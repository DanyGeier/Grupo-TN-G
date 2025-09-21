# syntax=docker/dockerfile:1

ARG PYTHON_VERSION=3.13.7
FROM python:${PYTHON_VERSION}-slim as base

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH="${PYTHONPATH}:/app/proto"

WORKDIR /app

# Dependencias del sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir grpcio grpcio-tools protobuf pymongo

# Copiar código fuente
COPY proto/ proto/
COPY server.py .

# Generar stubs gRPC
RUN python -m grpc_tools.protoc -I proto --python_out=proto --grpc_python_out=proto proto/inventario.proto \
    && touch proto/__init__.py

EXPOSE 9097

ENV PORT=9097
ENV MONGO_HOST=mongodb
ENV MONGO_PORT=27017
ENV MONGO_DB=inventario_db
ENV MONGO_USER=admin
ENV MONGO_PASS=admin123

CMD ["python", "server.py"]

