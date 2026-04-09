import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, Model

def conv_block(x, filters):
    x = layers.Conv3D(filters, 3, padding="same", activation="relu")(x)
    x = layers.BatchNormalization()(x)
    x = layers.Conv3D(filters, 3, padding="same", activation="relu")(x)
    x = layers.BatchNormalization()(x)
    return x

def encoder_block(x, filters):
    skip = conv_block(x, filters)
    pool = layers.MaxPooling3D(2)(skip)
    return skip, pool

def decoder_block(x, skip, filters):
    x = layers.Conv3DTranspose(filters, 2, strides=2, padding="same")(x)
    x = layers.Concatenate()([x, skip])
    x = conv_block(x, filters)
    return x

def build_unet(input_shape=(128, 128, 128, 4), num_classes=4):
    inputs = layers.Input(input_shape)
    s1, p1 = encoder_block(inputs, 16)
    s2, p2 = encoder_block(p1, 32)
    s3, p3 = encoder_block(p2, 64)
    s4, p4 = encoder_block(p3, 128)
    bridge  = conv_block(p4, 256)
    d1 = decoder_block(bridge, s4, 128)
    d2 = decoder_block(d1, s3, 64)
    d3 = decoder_block(d2, s2, 32)
    d4 = decoder_block(d3, s1, 16)
    outputs = layers.Conv3D(num_classes, 1, activation="softmax")(d4)
    return Model(inputs, outputs, name="3D_UNet")

_model = None

def get_model(weights_path="model/unet_weights.h5"):
    global _model
    if _model is None:
        _model = build_unet()
        try:
            _model.load_weights(weights_path)
            print("Weights loaded:", weights_path)
        except Exception as e:
            print(f"No weights found ({e}). Using random weights - demo mode.")
    return _model

def preprocess(volume, target=(128, 128, 128)):
    from skimage.transform import resize
    resized = resize(volume, target, mode="constant", anti_aliasing=True)
    v_min, v_max = resized.min(), resized.max()
    normed = (resized - v_min) / (v_max - v_min + 1e-8)
    multi  = np.stack([normed] * 4, axis=-1)
    return np.expand_dims(multi, 0).astype(np.float32)

def segment(volume):
    model  = get_model()
    tensor = preprocess(volume)
    pred   = model.predict(tensor)[0]
    labels = np.argmax(pred, axis=-1)
    binary = (labels > 0).astype(np.uint8)
    return binary
