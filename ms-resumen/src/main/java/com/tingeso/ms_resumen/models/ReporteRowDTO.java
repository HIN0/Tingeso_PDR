package com.tingeso.ms_resumen.models;

import java.time.LocalDate;
import lombok.Data;

@Data
public class ReporteRowDTO {
    private Integer nro;
    private LocalDate fecha;
    private String tipoDoc;
    private String numDoc;
    private String motivo;
    private Double ingreso;
    private Double salida;
    private Double saldo;
}