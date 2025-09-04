package com.grupog.repositories;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.grupog.entities.EventoEntity;

@Repository
public interface EventoRepository extends JpaRepository<EventoEntity, Long> {

	List<EventoEntity> findByFechaYHoraDelEventoAfter(LocalDateTime fecha);
	
	List<EventoEntity> findByFechaYHoraDelEventoBefore(LocalDateTime fecha);
	
	List<EventoEntity> findByNombreEventoContainingIgnoreCase(String nombre);
	
}
