package com.grupog.informes.repository;

import com.grupog.informes.model.FiltroDonacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FiltroDonacionRepository extends JpaRepository<FiltroDonacion, Long> {

    List<FiltroDonacion> findByUsuarioIdOrderByFechaCreacionDesc(Long usuarioId);
}
