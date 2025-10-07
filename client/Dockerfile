# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG PYTHON_VERSION=3.13.7
FROM python:${PYTHON_VERSION}-slim as base

# Prevents Python from writing pyc files.
ENV PYTHONDONTWRITEBYTECODE=1

ENV PYTHONPATH="${PYTHONPATH}:/app/proto"

# Keeps Python from buffering stdout and stderr to avoid situations where
# the application crashes without emitting any logs due to buffering.
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Create a non-privileged user that the app will run under.
# See https://docs.docker.com/go/dockerfile-user-best-practices/
ARG UID=10001
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "${UID}" \
    appuser

# Install system dependencies needed for grpcio-tools (protoc compiler runtime)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies (avoid installing the local package)
COPY pyproject.toml .
RUN pip install --upgrade pip \
    && pip install grpcio>=1.60.0 grpcio-tools>=1.60.0 protobuf>=4.25.0 flask>=3.0.0 flask-cors>=4.0.0 PyJWT>=2.9.0 requests>=2.32.3

# Copy the source code into the container.
COPY . .

# Generate gRPC stubs
RUN python -m grpc_tools.protoc -I proto --python_out=proto --grpc_python_out=proto proto/usuario.proto \
    && python -m grpc_tools.protoc -I proto --python_out=proto --grpc_python_out=proto proto/autenticacion.proto \
    && python -m grpc_tools.protoc -I proto --python_out=proto --grpc_python_out=proto proto/evento.proto \
    && python -m grpc_tools.protoc -I proto --python_out=proto --grpc_python_out=proto proto/inventario.proto

# Ensure proto is a package
RUN touch proto/__init__.py

# Change ownership of the entire app directory to appuser
RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 5000
CMD ["python", "app.py"]
