
import os, io, uuid
import numpy as np
import pydicom
from PIL import Image

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

from inference import segment
from mesh_utils import mask_to_obj

app = FastAPI(title="NeuroLens API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MESH_DIR = "static/meshes"
os.makedirs(MESH_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

def load_single_file(file_bytes: bytes, filename: str) -> np.ndarray:
    ext = filename.lower().split(".")[-1]

    if ext == "dcm":
        # DICOM file
        ds = pydicom.dcmread(io.BytesIO(file_bytes))
        slice_2d = ds.pixel_array.astype(np.float32)
    elif ext in ["png", "jpg", "jpeg"]:
        # PNG or JPG
        img = Image.open(io.BytesIO(file_bytes)).convert("L")  # grayscale
        slice_2d = np.array(img, dtype=np.float32)
    else:
        raise ValueError(f"Unsupported file type: {ext}")

    # We have 1 slice — stack it 64 times to fake a 3D volume
    # This lets the 3D U-Net run on a single 2D image for demo purposes
    volume = np.stack([slice_2d] * 64, axis=0)  # shape: (64, H, W)
    return volume

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    allowed = ["dcm", "png", "jpg", "jpeg"]
    ext = file.filename.lower().split(".")[-1]
    if ext not in allowed:
        raise HTTPException(400, f"Unsupported file. Upload a DICOM, PNG, or JPG file.")

    file_bytes = await file.read()

    # Load file into 3D volume
    try:
        volume = load_single_file(file_bytes, file.filename)
    except ValueError as e:
        raise HTTPException(422, str(e))

    # Run U-Net segmentation
    try:
        mask = segment(volume)
    except Exception as e:
        raise HTTPException(500, f"Segmentation failed: {e}")

    # Convert mask to .obj mesh
    mesh_id   = uuid.uuid4().hex
    mesh_path = f"{MESH_DIR}/{mesh_id}.obj"
    try:
        mask_to_obj(mask, mesh_path)
    except ValueError as e:
        raise HTTPException(422, str(e))

    return JSONResponse({"mesh_url": f"/static/meshes/{mesh_id}.obj"})

@app.get("/health")
def health():
    return {"status": "ok", "message": "NeuroLens backend running"}
