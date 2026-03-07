package com.tingeso.ms_resumen.models;

import java.time.LocalDate;
import lombok.Data;

@Data
public class SalidaDTO {
    private LocalDate fecha;
    private String tipoDocumento;
    private String numDocumento;
    private String motivo;
    private Double monto;
    // Getters, Setters (o @Data de Lombok)
}