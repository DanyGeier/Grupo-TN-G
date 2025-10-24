package com.grupog.informes.rest;

import com.grupog.informes.model.InventarioItem;
import com.grupog.informes.service.InformeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/informes")
@Tag(name = "Informes", description = "API para generación de informes de donaciones")
public class InformeRestController {

    @Autowired
    private InformeService informeService;

    @GetMapping("/donaciones/excel")
    @Operation(summary = "Generar informe Excel de donaciones",
               description = "Genera un archivo Excel con el detalle de donaciones agrupadas por categoría en hojas separadas")
    public ResponseEntity<byte[]> generarInformeExcel(
            @Parameter(description = "Categoría (opcional)")
            @RequestParam(required = false) String categoria,

            @Parameter(description = "Fecha desde (formato: yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaDesde,

            @Parameter(description = "Fecha hasta (formato: yyyy-MM-dd'T'HH:mm:ss)")
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fechaHasta,

            @Parameter(description = "Eliminado (true/false/null para ambos)")
            @RequestParam(required = false) Boolean eliminado) {

        try {
            // Obtener datos
            List<InventarioItem> items = informeService.obtenerDetalleParaExcel(
                categoria, fechaDesde, fechaHasta, eliminado
            );

            // Agrupar por categoría
            Map<String, List<InventarioItem>> itemsPorCategoria = items.stream()
                .collect(Collectors.groupingBy(InventarioItem::getCategoria));

            // Crear Excel
            Workbook workbook = new XSSFWorkbook();

            // Crear estilos
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

            // Crear una hoja por categoría
            for (Map.Entry<String, List<InventarioItem>> entry : itemsPorCategoria.entrySet()) {
                String categoriaName = entry.getKey();
                List<InventarioItem> itemsCategoria = entry.getValue();

                Sheet sheet = workbook.createSheet(categoriaName);

                // Encabezados
                Row headerRow = sheet.createRow(0);
                String[] headers = {"ID", "Fecha de Alta", "Descripción", "Cantidad", "Eliminado", "Usuario Alta", "Usuario Modificación"};
                for (int i = 0; i < headers.length; i++) {
                    Cell cell = headerRow.createCell(i);
                    cell.setCellValue(headers[i]);
                    cell.setCellStyle(headerStyle);
                }

                // Datos
                int rowNum = 1;
                for (InventarioItem item : itemsCategoria) {
                    Row row = sheet.createRow(rowNum++);
                    row.createCell(0).setCellValue(item.getId());
                    row.createCell(1).setCellValue(item.getFechaAlta().format(formatter));
                    row.createCell(2).setCellValue(item.getDescripcion() != null ? item.getDescripcion() : "");
                    row.createCell(3).setCellValue(item.getCantidad());
                    row.createCell(4).setCellValue(item.getEliminado() ? "Sí" : "No");
                    row.createCell(5).setCellValue(item.getUsuarioAlta() != null ? item.getUsuarioAlta() : "");
                    row.createCell(6).setCellValue(item.getUsuarioModificacion() != null ? item.getUsuarioModificacion() : "");
                }

                // Autoajustar columnas
                for (int i = 0; i < headers.length; i++) {
                    sheet.autoSizeColumn(i);
                }
            }

            // Escribir a byte array
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            workbook.close();

            // Preparar respuesta
            String filename = "informe_donaciones_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) + ".xlsx";

            HttpHeaders headersResponse = new HttpHeaders();
            headersResponse.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headersResponse.setContentDispositionFormData("attachment", filename);

            return ResponseEntity.ok()
                .headers(headersResponse)
                .body(outputStream.toByteArray());

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}

