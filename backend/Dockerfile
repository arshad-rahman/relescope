# syntax=docker/dockerfile:1

FROM python:3.13-slim AS runtime

LABEL org.opencontainers.image.title="Relescope Backend"
LABEL org.opencontainers.image.description="FastAPI backend for Relescope"
LABEL org.opencontainers.image.source="https://github.com/arshad-rahman/relescope"

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

RUN groupadd \
      --gid 10001 \
      relescope \
    && useradd \
      --uid 10001 \
      --gid relescope \
      --create-home \
      --home-dir /home/relescope \
      --shell /usr/sbin/nologin \
      relescope

COPY requirements.txt ./

RUN python -m pip install \
      --upgrade pip \
    && python -m pip install \
      --no-cache-dir \
      -r requirements.txt

COPY \
  --chown=relescope:relescope \
  . \
  .

RUN mkdir -p /app/data \
    && chown -R \
      relescope:relescope \
      /app \
      /home/relescope

USER relescope

EXPOSE 8000

HEALTHCHECK \
  --interval=30s \
  --timeout=5s \
  --start-period=10s \
  --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health', timeout=3).read()" || exit 1

CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
