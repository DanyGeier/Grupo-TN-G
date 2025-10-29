from flask import Blueprint, request, jsonify, Response, make_response
import requests
import os

informes_bp = Blueprint("informes", __name__, url_prefix="/informes")

# URL del servicio de informes
INFORMES_BASE_URL = os.getenv("INFORMES_BASE_URL", "http://informes:8084")


@informes_bp.route("/graphql", methods=["POST", "OPTIONS"])
def graphql_proxy():
    """Proxy para consultas GraphQL al servicio de informes"""

    # Manejar preflight CORS
    if request.method == "OPTIONS":
        return "", 200

    try:
        # Obtener el body de la request
        graphql_request = request.get_json()
        print(f"[INFORMES] GraphQL request: {graphql_request}")

        # Hacer la petición al servicio de informes
        url = f"{INFORMES_BASE_URL}/graphql"
        print(f"[INFORMES] Llamando a: {url}")

        response = requests.post(
            url,
            json=graphql_request,
            headers={"Content-Type": "application/json"},
            timeout=10,
        )

        print(f"[INFORMES] Status code: {response.status_code}")
        print(
            f"[INFORMES] Response text: {response.text[:200]}"
        )  # Primeros 200 caracteres

        # Retornar la respuesta como JSON
        result = response.json()
        print(
            f"[INFORMES] Response JSON keys: {result.keys() if isinstance(result, dict) else 'not a dict'}"
        )
        return jsonify(result), response.status_code

    except requests.exceptions.RequestException as e:
        print(f"[INFORMES] Request error: {str(e)}")
        return (
            jsonify(
                {"error": f"Error al conectar con el servicio de informes: {str(e)}"}
            ),
            500,
        )
    except Exception as e:
        print(f"[INFORMES] Error: {str(e)}")
        return jsonify({"error": str(e)}), 500


@informes_bp.route("/donaciones/excel", methods=["GET"])
def descargar_excel_donaciones():
    """Endpoint REST para descargar Excel de donaciones"""
    try:
        # Obtener parámetros de query
        params = {}
        if request.args.get("categoria"):
            params["categoria"] = request.args.get("categoria")
        if request.args.get("fechaDesde"):
            params["fechaDesde"] = request.args.get("fechaDesde")
        if request.args.get("fechaHasta"):
            params["fechaHasta"] = request.args.get("fechaHasta")
        if request.args.get("eliminado"):
            params["eliminado"] = request.args.get("eliminado")

        # Hacer la petición al servicio de informes
        response = requests.get(
            f"{INFORMES_BASE_URL}/api/informes/donaciones/excel",
            params=params,
            headers={
                "Accept": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            },
        )

        if response.status_code != 200:
            return (
                jsonify({"error": "Error al generar el archivo Excel"}),
                response.status_code,
            )

        # Retornar el archivo Excel
        return Response(
            response.content,
            status=200,
            headers={
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": f"attachment; filename=informe_donaciones.xlsx",
            },
        )

    except requests.exceptions.RequestException as e:
        return (
            jsonify(
                {"error": f"Error al conectar con el servicio de informes: {str(e)}"}
            ),
            500,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# INFORMES SOAP
@informes_bp.route("/soap/informe/presidentes-ongs", methods=["POST", "OPTIONS"])
def soap_informe_completo():
    # Manejar preflight CORS
    if request.method == "OPTIONS":
        response = make_response("", 200)
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Max-Age"] = "86400"
        return response

    try:
        data = request.get_json() or {}
        org_ids = data.get("orgIds", [])
        print(f"[INFORMES-SOAP] Request data: {data}")
        print(f"[INFORMES-SOAP] Org IDs: {org_ids}")

        # Llamar a Spring Boot
        url = f"{INFORMES_BASE_URL}/soap/informe/presidentes-ongs"
        print(f"[INFORMES-SOAP] Calling: {url}")

        response = requests.post(url, json=org_ids, timeout=10)
        print(f"[INFORMES-SOAP] Response status: {response.status_code}")
        print(f"[INFORMES-SOAP] Response text: {response.text[:200]}")

        response.raise_for_status()

        result = response.json()
        print(f"[INFORMES-SOAP] Response JSON: {result}")

        # Agregar headers CORS a la respuesta
        flask_response = jsonify(result)
        flask_response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
        flask_response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        flask_response.headers["Access-Control-Allow-Headers"] = "Content-Type"

        return flask_response, 200

    except requests.exceptions.RequestException as e:
        print(f"[INFORMES-SOAP] Request error: {str(e)}")
        error_response = jsonify(
            {"error": f"Error al conectar con el servicio de informes: {str(e)}"}
        )
        error_response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
        return error_response, 500
    except Exception as e:
        print(f"[INFORMES-SOAP] General error: {str(e)}")
        error_response = jsonify({"error": str(e)})
        error_response.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
        return error_response, 500
