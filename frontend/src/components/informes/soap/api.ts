import type { InformeCompletoDTO } from "./interfaces/interfaces";


const BASE_URL = "http://localhost:5000/informes";

export const obtenerInformeCompletoSOAP = async (orgIds: number[]): Promise<InformeCompletoDTO[]> => {
  const response = await fetch(`${BASE_URL}/soap/informe/presidentes-ongs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orgIds }),
  });

  if (!response.ok) throw new Error("Error al obtener el informe SOAP.Chequee que las ids ingresadas sean correctas");

  return (await response.json()) as InformeCompletoDTO[];
};