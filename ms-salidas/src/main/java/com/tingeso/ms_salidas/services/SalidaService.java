package com.tingeso.ms_salidas.services;

import com.tingeso.ms_salidas.entities.SalidaEntity;
import com.tingeso.ms_salidas.repositories.SalidaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class SalidaService {
    @Autowired
    SalidaRepository salidaRepository;

    public SalidaEntity guardarSalida(SalidaEntity salida) {
        return salidaRepository.save(salida);
    }

    public List<SalidaEntity> obtenerTodas() {
        return salidaRepository.findAll();
    }

    public List<SalidaEntity> obtenerPorRangoFechas(LocalDate inicio, LocalDate fin) {
        return salidaRepository.findByFechaBetween(inicio, fin);
    }
}