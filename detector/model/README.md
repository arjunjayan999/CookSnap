# detector/model

Contains the trained model used by the detector service.

- `model.pt` — PyTorch model checkpoint used by `main.py` to make predictions.

Notes:

- This file is binary and may be large. Don't store additional large model versions here without considering LFS or external hosting.
- If you retrain the model, replace `model.pt` and verify compatibility with `main.py`.
