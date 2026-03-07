package com.tingeso.ms_salidas.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "salidas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalidaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate fecha;
    private String tipoDocumento; // Boleta o Factura 
    private String numDocumento;
    private String motivo; // Artículos de oficina, Limpieza, etc. 
    private Double monto;
}