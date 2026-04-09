import os
import numpy as np
from skimage.measure import marching_cubes
from scipy.ndimage import binary_closing, label as nd_label

def largest_component(mask):
    labeled, num = nd_label(mask)
    if num == 0:
        return mask
    sizes   = [np.sum(labeled == i) for i in range(1, num + 1)]
    biggest = np.argmax(sizes) + 1
    return (labeled == biggest).astype(np.uint8)

def mask_to_obj(mask, output_path):
    mask = binary_closing(mask, iterations=2).astype(np.uint8)
    mask = largest_component(mask)
    if mask.sum() == 0:
        raise ValueError("Segmentation is empty - no tumor detected.")
    verts, faces, normals, _ = marching_cubes(mask, level=0.5, step_size=2)
    verts -= verts.mean(axis=0)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w") as f:
        f.write("# NeuroLens tumor mesh\n")
        for v in verts:
            f.write(f"v {v[0]:.4f} {v[1]:.4f} {v[2]:.4f}\n")
        for n in normals:
            f.write(f"vn {n[0]:.4f} {n[1]:.4f} {n[2]:.4f}\n")
        for i, face in enumerate(faces):
            a, b, c = face + 1
            f.write(f"f {a}//{a} {b}//{b} {c}//{c}\n")
    return output_path
