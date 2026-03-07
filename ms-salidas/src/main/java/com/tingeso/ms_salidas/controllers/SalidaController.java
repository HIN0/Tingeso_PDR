package com.tingeso.ms_salidas.controllers;

import com.tingeso.ms_salidas.entities.SalidaEntity;
import com.tingeso.ms_salidas.services.SalidaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/salidas")
public class SalidaController {
    @Autowired
    SalidaService salidaService;

    @PostMapping("/")
    public ResponseEntity<SalidaEntity> registrarSalida(@RequestBody SalidaEntity salida) {
        return ResponseEntity.ok(salidaService.guardarSalida(salida));
    }

    @GetMapping("/")
    public ResponseEntity<List<SalidaEntity>> listarTodas() {
        return ResponseEntity.ok(salidaService.obtenerTodas());
    }

    @GetMapping("/reporte")
    public ResponseEntity<List<SalidaEntity>> obtenerParaReporte(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(salidaService.obtenerPorRangoFechas(inicio, fin));
    }
}