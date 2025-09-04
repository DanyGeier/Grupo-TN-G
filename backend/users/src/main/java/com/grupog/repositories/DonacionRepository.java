package com.grupog.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.grupog.entities.DonacionEntity;

@Repository
public interface DonacionRepository extends JpaRepository<DonacionEntity, Long> {

	List<DonacionEntity> findByEliminadoFalse();
}
