import React from "react";
import type { InformeCompletoDTO } from "./interfaces/interfaces";

// Props del componente
interface InformeCompletoListProps {
  informes: InformeCompletoDTO[];
}

// Componente
export const InformeCompletoList: React.FC<InformeCompletoListProps> = ({ informes }) => {
  if (!informes || informes.length === 0) {
    return <p>No hay información disponible.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {informes.map((inf, idx) => (
        <div
          key={idx}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "1rem",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3>ONG: {inf.associationDTO?.name || "N/A"}</h3>
          <p><strong>ID ONG:</strong> {inf.associationDTO?.id ?? "N/A"}</p>
          <p><strong>Dirección ONG:</strong> {inf.associationDTO?.address || "N/A"}</p>
          <p><strong>Teléfono ONG:</strong> {inf.associationDTO?.phone || "N/A"}</p>

          <h4 style={{ marginTop: "0.5rem" }}>Presidente:</h4>
          <p><strong>ID Presidente:</strong> {inf.presidentDTO?.id ?? "N/A"}</p>
          <p><strong>Nombre:</strong> {inf.presidentDTO?.name || "N/A"}</p>
          <p><strong>Dirección:</strong> {inf.presidentDTO?.address || "N/A"}</p>
          <p><strong>Teléfono:</strong> {inf.presidentDTO?.phone || "N/A"}</p>
          <p><strong>ID Organización:</strong> {inf.presidentDTO?.organizationId ?? "N/A"}</p>
        </div>
      ))}
    </div>
  );
};
