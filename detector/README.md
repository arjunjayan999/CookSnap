# Detector Service

This folder contains the image detection service used by CookSnap to detect ingredients from images.

**Quick Overview**

- **Entry**: `main.py`
- **Model**: `model/model.pt` (PyTorch model)
- **Requirements**: `requirements.txt`

**Run (development)**

This project provides `pnpm` convenience scripts for setting up and running the detector. From the repository root you can:

```
pnpm install
pnpm dev:detector
```

Alternatively, to prepare the Python virtual environment for the detector (Windows):

```
pnpm -F detector install
pnpm -F detector dev
```

If you prefer to do it manually:

1. Create a Python virtual environment and install dependencies:

```
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

2. Start the detector (ensure model file is present):

```
python main.py
```

The service exposes an HTTP endpoint that accepts image uploads and returns detected ingredient labels and bounding boxes.

**Model file**

- The model binary is in `detector/model/model.pt`. See `detector/model/README.md`.
