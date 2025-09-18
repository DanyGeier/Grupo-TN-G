# syntax=docker/dockerfile:1
FROM python:3.13-slim

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH="${PYTHONPATH}:/app/proto"

# Instalar dependencias
COPY pyproject.toml .
RUN pip install --upgrade pip
RUN pip install . && pip install grpcio-tools flask-cors

# Copiar el código fuente
COPY . .

# Compilar protos
RUN python -m grpc_tools.protoc -I proto --python_out=proto --grpc_python_out=proto proto/usuario.proto
RUN python -m grpc_tools.protoc -I proto --python_out=proto --grpc_python_out=proto proto/autenticacion.proto
RUN touch proto/__init__.py

EXPOSE 5000
CMD ["python", "app.py"]