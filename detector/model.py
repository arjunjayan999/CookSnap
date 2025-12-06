"""
Model loader and inference wrapper for detector microservice.

This module attempts to load a YOLO model (Ultralytics) from `MODEL_PATH` (local file)
or download from `MODEL_URL` into `./model/model.pt`. If no model is available, the service
runs in mock mode and returns empty or example detections for local development.

The API exposes `predict(image_bytes)` which returns a list of detections of the form:
[ { label: str, confidence: float, bbox: { x, y, w, h } }, ... ]

Notes:
- This uses the `ultralytics` library (pip package). If the import fails at runtime, the
  module falls back to mock mode and returns a predictable response.
"""
import os
import io
import time
import requests
from PIL import Image
import numpy as np


MODEL_DIR = os.path.join(os.path.dirname(__file__), 'model')
MODEL_PATH = os.environ.get('MODEL_PATH') or os.path.join(MODEL_DIR, 'model.pt')
MODEL_URL = os.environ.get('MODEL_URL')

_MODEL = None
_MOCK = False
_NAMES = {}


def _download_model(url, dest_path):
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    print(f'Downloading model from {url} to {dest_path} ...')
    r = requests.get(url, stream=True, timeout=60)
    r.raise_for_status()
    with open(dest_path, 'wb') as f:
        for chunk in r.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)
    print('Model downloaded')


def _try_load_ultralytics(path):
    global _MODEL, _NAMES
    try:
        
        from ultralytics import YOLO
    except Exception as e:
        print('ultralytics import failed:', e)
        return False

    try:
        print('Loading model from', path)
        _MODEL = YOLO(path)
        
        try:
            _NAMES = _MODEL.names if hasattr(_MODEL, 'names') else {}
        except Exception:
            _NAMES = {}
        print('Model loaded, names:', _NAMES)
        return True
    except Exception as e:
        print('Failed to load model:', e)
        _MODEL = None
        return False


def initialize_model():
    """Attempt to ensure a model is available. Sets _MODEL or _MOCK accordingly."""
    global _MOCK
    if os.path.exists(MODEL_PATH):
        ok = _try_load_ultralytics(MODEL_PATH)
        if ok:
            return

    if MODEL_URL:
        try:
            _download_model(MODEL_URL, MODEL_PATH)
            ok = _try_load_ultralytics(MODEL_PATH)
            if ok:
                return
        except Exception as e:
            print('Model download failed:', e)

    print('No model available, running in MOCK mode')
    _MOCK = True


def _mock_predictions(image_bytes):
    return [
        {"label": "tomato", "confidence": 0.87, "bbox": {"x": 10, "y": 20, "w": 100, "h": 80}},
        {"label": "egg", "confidence": 0.65, "bbox": {"x": 150, "y": 40, "w": 60, "h": 60}}
    ]


def predict(image_bytes):
    """Run inference on raw image bytes and return list of detections.

    Each detection is: { label, confidence, bbox: { x, y, w, h } }
    Coordinates are in pixels relative to the input image.
    """
    global _MODEL, _MOCK, _NAMES

    if _MOCK or _MODEL is None:
        return _mock_predictions(image_bytes)

    try:
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        img_arr = np.array(img)
    except Exception as e:
        print('Failed to read image for prediction:', e)
        return []

    try:
        results = _MODEL(img_arr)
        r = results[0]
        detections = []

        boxes = getattr(r, 'boxes', None)
        if boxes is not None:
            try:
                xyxy = boxes.xyxy.cpu().numpy()
            except Exception:
                try:
                    xyxy = boxes.xyxy.numpy()
                except Exception:
                    xyxy = getattr(boxes, 'numpy', lambda: [])()

            try:
                confs = boxes.conf.cpu().numpy()
            except Exception:
                try:
                    confs = boxes.conf.numpy()
                except Exception:
                    confs = [0] * len(xyxy)


            try:
                clsids = boxes.cls.cpu().numpy()
            except Exception:
                try:
                    clsids = boxes.cls.numpy()
                except Exception:
                    clsids = [None] * len(xyxy)

            for i, box in enumerate(xyxy):
                x1, y1, x2, y2 = map(float, box[:4])
                w = x2 - x1
                h = y2 - y1
                conf = float(confs[i]) if i < len(confs) else 0.0
                cid = int(clsids[i]) if (i < len(clsids) and clsids[i] is not None) else None
                label = _NAMES.get(cid, str(cid)) if cid is not None else 'object'
                detections.append({
                    'label': label,
                    'confidence': round(conf, 4),
                    'bbox': {'x': round(x1, 2), 'y': round(y1, 2), 'w': round(w, 2), 'h': round(h, 2)}
                })
            return detections

        try:
            data = getattr(r, 'boxes').data
            arr = data.cpu().numpy() if hasattr(data, 'cpu') else np.array(data)
            detections = []
            for row in arr:
                x1, y1, x2, y2, conf, clsid = row[:6]
                w = float(x2 - x1)
                h = float(y2 - y1)
                label = _NAMES.get(int(clsid), str(int(clsid))) if _NAMES else str(int(clsid))
                detections.append({
                    'label': label,
                    'confidence': float(conf),
                    'bbox': {'x': float(x1), 'y': float(y1), 'w': w, 'h': h}
                })
            return detections
        except Exception:
            print('No boxes found in results, returning empty list')
            return []

    except Exception as e:
        print('Model inference failed:', e)
        return []


initialize_model()
