package com.tingeso.ms_entradas.controllers;

import com.tingeso.ms_entradas.entities.EntradaEntity;
import com.tingeso.ms_entradas.services.EntradaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/entradas")
public class EntradaController {
    @Autowired
    EntradaService entradaService;

    @PostMapping("/")
    public ResponseEntity<EntradaEntity> registrarEntrada(@RequestBody EntradaEntity entrada) {
        return ResponseEntity.ok(entradaService.guardarEntrada(entrada));
    }

    @GetMapping("/")
    public ResponseEntity<List<EntradaEntity>> listarTodas() {
        return ResponseEntity.ok(entradaService.obtenerTodas());
    }

    @GetMapping("/reporte")
    public ResponseEntity<List<EntradaEntity>> obtenerParaReporte(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(entradaService.obtenerPorRangoFechas(inicio, fin));
    }
}