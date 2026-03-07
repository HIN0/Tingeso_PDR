package com.tingeso.ms_entradas.repositories;

import com.tingeso.ms_entradas.entities.EntradaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface EntradaRepository extends JpaRepository<EntradaEntity, Long> {
    // Útil para el reporte resumen posterior
    List<EntradaEntity> findByFechaBetween(LocalDate start, LocalDate end);
}