package com.tingeso.ms_salidas.repositories;

import com.tingeso.ms_salidas.entities.SalidaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SalidaRepository extends JpaRepository<SalidaEntity, Long> {
    // Necesario para filtrar los movimientos en el reporte resumen [cite: 17]
    List<SalidaEntity> findByFechaBetween(LocalDate start, LocalDate end);
}