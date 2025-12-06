
FROM python:3.10-slim AS base

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

FROM base AS dev

ENV DEV=1

CMD ["python", "main.py"]


FROM base AS prod

ENV DEV=""

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
