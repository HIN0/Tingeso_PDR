package com.tingeso.ms_resumen.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tingeso.ms_resumen.models.ReporteRowDTO;
import com.tingeso.ms_resumen.services.ResumenService;

@RestController
@RequestMapping("/api/resumen")
public class ResumenController {
    @Autowired
    ResumenService resumenService;

    @GetMapping("/")
    public ResponseEntity<List<ReporteRowDTO>> obtenerReporte(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fin) {
        return ResponseEntity.ok(resumenService.generarReporte(inicio, fin));
    }
}