"""
FastAPI detector microservice exposing POST /detect

Accepts a multipart form with field `image` (single file). Returns JSON array of detections:
[ { label, confidence, bbox: { x, y, w, h } }, ... ]

Runs on port 8000 by default.
"""
import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import traceback

from model import predict

app = FastAPI(title='CookSnap Detector')


ALLOW_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '*')
origins = [o.strip() for o in ALLOW_ORIGINS.split(',')] if ALLOW_ORIGINS != '*' else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post('/detect')
async def detect(image: UploadFile = File(...)):
    try:
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail='File must be an image')

        image_bytes = await image.read()
        detections = predict(image_bytes)
        return detections
    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail='Detection failed')


if __name__ == '__main__':
    import uvicorn
    port = int(os.environ.get('PORT', 8000))
    uvicorn.run('main:app', host='0.0.0.0', port=port, reload=os.environ.get('DEV', '') != '')
