import os
from typing import Optional, Tuple
import jwt
import base64
from flask import request
from .grpcClient import UsuarioClient

JWT_SECRET = os.getenv("JWT_SECRET", "MNaqsShS5O6DvPeEW1Vm5e0iSu1JsJOZExWgqsf3gXw")
JWT_ALGS = ("HS256", "HS512")

_usuario_client: Optional[UsuarioClient] = None

def _get_usuario_client() -> UsuarioClient:
    global _usuario_client
    if _usuario_client is None:
        _usuario_client = UsuarioClient()
    return _usuario_client


def extract_bearer_token() -> Optional[str]:
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None
    token = auth_header.strip()
    # Remover uno o más prefijos 'Bearer '
    for _ in range(2):
        if token.lower().startswith("bearer "):
            token = token[7:].strip()
    return token or None


def _b64_padded(s: str) -> bytes:
    # Asegurar padding para Base64
    pad_len = (-len(s)) % 4
    s_padded = s + ("=" * pad_len)
    return base64.b64decode(s_padded)


def decode_jwt(token: str) -> Optional[dict]:
    # Normalizar por si aún viene con 'Bearer '
    if token and token.lower().startswith("bearer "):
        token = token[7:].strip()
    # Probar combinaciones (clave base64/cruda x algoritmos)
    combos = []
    try:
        combos.append((_b64_padded(JWT_SECRET), JWT_ALGS))
    except Exception:
        pass
    combos.append((JWT_SECRET.encode(), JWT_ALGS))

    for key, algs in combos:
        try:
            payload = jwt.decode(token, key, algorithms=list(algs))
            print(f"[JWT] decode OK. algs={algs} sub={payload.get('sub')}")
            return payload
        except Exception as e:
            print(f"[JWT] decode failed with algs={algs}: {e}")
    return None


def get_current_user() -> Optional[dict]:
    """
    Devuelve el usuario actual a partir del JWT: {id, nombreUsuario, rol, estado, email, ...}
    o None si no hay token o es inválido.
    """
    token = extract_bearer_token()
    print(f"[AUTH] Authorization present: {bool(token)}")
    if not token:
        return None
    payload = decode_jwt(token)
    if not payload:
        print("[AUTH] Invalid token payload")
        return None
    # Intentar distintas claims posibles
    username = payload.get("sub") or payload.get("username") or payload.get("nombreUsuario")
    print(f"[AUTH] Token subject: {username}")
    client = _get_usuario_client()
    if username:
        try:
            u = client.buscarUsuarioPorNombreUsuario(username)
            print(f"[AUTH] gRPC user found: id={u.id}, rol={u.rol}, estado={u.estado}")
            return {
                "id": u.id,
                "nombreUsuario": u.nombreUsuario,
                "nombre": u.nombre,
                "apellido": u.apellido,
                "email": u.email,
                "rol": u.rol,
                "estado": u.estado,
            }
        except Exception as e:
            print(f"[AUTH] lookup by nombreUsuario failed: {e}")
    # Si sub es numérico, intentar por ID
    sub = payload.get("sub")
    if isinstance(sub, (int,)) or (isinstance(sub, str) and sub.isdigit()):
        try:
            u = client.buscarUsuarioPorId(int(sub))
            print(f"[AUTH] gRPC user found by id: id={u.id}, rol={u.rol}, estado={u.estado}")
            return {
                "id": u.id,
                "nombreUsuario": u.nombreUsuario,
                "nombre": u.nombre,
                "apellido": u.apellido,
                "email": u.email,
                "rol": u.rol,
                "estado": u.estado,
            }
        except Exception as e:
            print(f"[AUTH] lookup by id failed: {e}")
    return None


def require_role(roles: list[int]) -> Tuple[Optional[dict], Optional[tuple]]:
    """
    Verifica que el usuario autenticado tenga uno de los roles requeridos.
    Retorna (usuario, None) si ok; o (None, (json, status_code)) si falla.
    """
    user = get_current_user()
    if user is None:
        return None, ({"error": "Token de autorización requerido o inválido"}, 401)
    if user.get("rol") not in roles:
        return None, ({"error": "Acceso denegado"}, 403)
    return user, None
