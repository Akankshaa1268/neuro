import io
import uuid
from pathlib import Path

import numpy as np
import pydicom
from pydicom.errors import InvalidDicomError
from PIL import Image

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from mesh_utils import mask_to_obj

app = FastAPI(title="NeuroLens API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
MESH_DIR = STATIC_DIR / "meshes"
DICOM_EXTENSIONS = {"dcm", "dicom"}
IMAGE_EXTENSIONS = {"png", "jpg", "jpeg"}
DICOM_CONTENT_TYPES = {"application/dicom"}
IMAGE_CONTENT_TYPES = {"image/jpeg", "image/png"}

MESH_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


class UnsupportedFileError(ValueError):
    pass


def get_extension(filename: str | None) -> str:
    return Path(filename or "").suffix.lower().lstrip(".")


def looks_like_dicom(file_bytes: bytes) -> bool:
    return len(file_bytes) >= 132 and file_bytes[128:132] == b"DICM"


def is_dicom_upload(file_bytes: bytes, filename: str | None, content_type: str | None) -> bool:
    return (
        get_extension(filename) in DICOM_EXTENSIONS
        or (content_type or "").lower() in DICOM_CONTENT_TYPES
        or looks_like_dicom(file_bytes)
    )


def is_image_upload(filename: str | None, content_type: str | None) -> bool:
    return (
        get_extension(filename) in IMAGE_EXTENSIONS
        or (content_type or "").lower() in IMAGE_CONTENT_TYPES
    )


def build_demo_volume(slice_2d: np.ndarray, depth: int = 64) -> np.ndarray:
    return np.repeat(slice_2d[np.newaxis, ...], depth, axis=0).astype(np.float32, copy=False)


def load_dicom_volume(file_bytes: bytes) -> np.ndarray:
    try:
        dataset = pydicom.dcmread(io.BytesIO(file_bytes), force=True)
    except InvalidDicomError as exc:
        raise ValueError("Uploaded file is not a valid DICOM file.") from exc

    if "PixelData" not in dataset:
        raise ValueError("DICOM file does not contain pixel data.")

    try:
        pixels = dataset.pixel_array
    except Exception as exc:
        transfer_syntax = getattr(getattr(dataset, "file_meta", None), "TransferSyntaxUID", None)
        if transfer_syntax is not None and getattr(transfer_syntax, "is_compressed", False):
            raise ValueError(
                "DICOM file uses a compressed transfer syntax that this server cannot decode."
            ) from exc
        raise ValueError("DICOM pixel data could not be decoded.") from exc

    pixels = np.asarray(pixels, dtype=np.float32)
    slope = float(getattr(dataset, "RescaleSlope", 1) or 1)
    intercept = float(getattr(dataset, "RescaleIntercept", 0) or 0)
    pixels = pixels * slope + intercept

    if str(getattr(dataset, "PhotometricInterpretation", "")).upper() == "MONOCHROME1":
        pixels = pixels.max() - pixels

    samples_per_pixel = int(getattr(dataset, "SamplesPerPixel", 1) or 1)
    if pixels.ndim == 2:
        return build_demo_volume(pixels)
    if pixels.ndim == 3 and samples_per_pixel > 1:
        return build_demo_volume(pixels[..., :samples_per_pixel].mean(axis=-1))
    if pixels.ndim == 3:
        return pixels.astype(np.float32, copy=False)
    if pixels.ndim == 4 and samples_per_pixel > 1:
        return pixels[..., :samples_per_pixel].mean(axis=-1).astype(np.float32, copy=False)
    raise ValueError(f"Unsupported DICOM pixel shape: {pixels.shape}")


def load_image_volume(file_bytes: bytes) -> np.ndarray:
    try:
        image = Image.open(io.BytesIO(file_bytes)).convert("L")
    except Exception as exc:
        raise ValueError("Uploaded image could not be decoded.") from exc
    return build_demo_volume(np.array(image, dtype=np.float32))


def load_single_file(file_bytes: bytes, filename: str | None, content_type: str | None = None) -> np.ndarray:
    if is_dicom_upload(file_bytes, filename, content_type):
        return load_dicom_volume(file_bytes)
    if is_image_upload(filename, content_type):
        return load_image_volume(file_bytes)
    raise UnsupportedFileError("Unsupported file. Upload a DICOM (.dcm/.dicom), PNG, or JPG file.")


def segment_volume(volume: np.ndarray) -> np.ndarray:
    from inference import segment

    return segment(volume)


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    file_bytes = await file.read()

    try:
        volume = load_single_file(file_bytes, file.filename, file.content_type)
    except UnsupportedFileError as exc:
        raise HTTPException(400, str(exc)) from exc
    except ValueError as e:
        raise HTTPException(422, str(e)) from e

    try:
        mask = segment_volume(volume)
    except Exception as e:
        raise HTTPException(500, f"Segmentation failed: {e}") from e

    mesh_id = uuid.uuid4().hex
    mesh_path = MESH_DIR / f"{mesh_id}.obj"
    try:
        mask_to_obj(mask, str(mesh_path))
    except ValueError as e:
        raise HTTPException(422, str(e)) from e

    return JSONResponse({"mesh_url": f"/static/meshes/{mesh_id}.obj"})


@app.get("/health")
def health():
    return {"status": "ok", "message": "NeuroLens backend running"}
