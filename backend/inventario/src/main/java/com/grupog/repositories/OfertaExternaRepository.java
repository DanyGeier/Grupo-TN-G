package com.grupog.repositories;

import com.grupog.entities.OfertaExternaEntity;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;


@Repository
public interface OfertaExternaRepository extends JpaRepository<OfertaExternaEntity, Long>{

}
