package com.tingeso.ms_resumen.models;

import java.time.LocalDate;
import lombok.Data;

@Data
public class EntradaDTO {
    private LocalDate fecha;
    private String nroRecibo;
    private Double monto;
    // Getters, Setters (o @Data de Lombok)
}