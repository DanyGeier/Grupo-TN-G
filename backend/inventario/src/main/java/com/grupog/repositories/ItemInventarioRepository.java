package com.grupog.repositories;

import com.grupog.entities.ItemInventarioEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ItemInventarioRepository extends JpaRepository<ItemInventarioEntity, Long> {
    List<ItemInventarioEntity> findByEliminadoFalse();
    Optional<ItemInventarioEntity> findByIdAndEliminadoFalse(Long id);
    Optional<ItemInventarioEntity> findFirstByCategoriaAndDescripcionAndEliminadoFalse(String categoria, String descripcion);
}
