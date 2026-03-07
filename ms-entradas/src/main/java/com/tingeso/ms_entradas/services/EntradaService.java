package com.tingeso.ms_entradas.services;

import com.tingeso.ms_entradas.entities.EntradaEntity;
import com.tingeso.ms_entradas.repositories.EntradaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class EntradaService {
    @Autowired
    EntradaRepository entradaRepository;

    public EntradaEntity guardarEntrada(EntradaEntity entrada) {
        return entradaRepository.save(entrada);
    }

    public List<EntradaEntity> obtenerTodas() {
        return entradaRepository.findAll();
    }

    public List<EntradaEntity> obtenerPorRangoFechas(LocalDate inicio, LocalDate fin) {
        return entradaRepository.findByFechaBetween(inicio, fin);
    }
}