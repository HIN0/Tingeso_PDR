package com.tingeso.ms_resumen.services;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.tingeso.ms_resumen.models.EntradaDTO;
import com.tingeso.ms_resumen.models.ReporteRowDTO;
import com.tingeso.ms_resumen.models.SalidaDTO;

import org.springframework.beans.factory.annotation.Value;

@Service
public class ResumenService {
    @Autowired
    RestTemplate restTemplate;

    @Value("${servicio.entradas.url}")
    String entradasUrl;

    @Value("${servicio.salidas.url}")
    String salidasUrl;

    public List<ReporteRowDTO> generarReporte(LocalDate inicio, LocalDate fin) {
        // 1. Obtener datos de ambos microservicios
        String query = "?inicio=" + inicio + "&fin=" + fin;
        EntradaDTO[] entradas = restTemplate.getForObject(entradasUrl + query, EntradaDTO[].class);
        SalidaDTO[] salidas = restTemplate.getForObject(salidasUrl + query, SalidaDTO[].class);

        // Validar que no sean nulos antes de procesar
        if (entradas == null) entradas = new EntradaDTO[0];
        if (salidas == null) salidas = new SalidaDTO[0];

        List<ReporteRowDTO> reporte = new ArrayList<>();

        // 2. Mapear entradas a filas del reporte
        for (EntradaDTO e : entradas) {
            ReporteRowDTO row = new ReporteRowDTO();
            row.setFecha(e.getFecha());
            row.setTipoDoc("Recibo");
            row.setNumDoc(e.getNroRecibo());
            row.setMotivo("Ingreso a Caja");
            row.setIngreso(e.getMonto());
            row.setSalida(0.0);
            reporte.add(row);
        }

        // 3. Mapear salidas a filas del reporte
        for (SalidaDTO s : salidas) {
            ReporteRowDTO row = new ReporteRowDTO();
            row.setFecha(s.getFecha());
            row.setTipoDoc(s.getTipoDocumento());
            row.setNumDoc(s.getNumDocumento());
            row.setMotivo(s.getMotivo());
            row.setIngreso(0.0);
            row.setSalida(s.getMonto());
            reporte.add(row);
        }

        // 4. Ordenar por fecha 
        reporte.sort(Comparator.comparing(ReporteRowDTO::getFecha));

        // 5. Calcular saldo acumulado y asignar números
        Double saldoAcumulado = 0.0;
        for (int i = 0; i < reporte.size(); i++) {
            ReporteRowDTO row = reporte.get(i);
            row.setNro(i + 1);
            saldoAcumulado += (row.getIngreso() - row.getSalida());
            row.setSaldo(saldoAcumulado);
        }

        return reporte;
    }
}