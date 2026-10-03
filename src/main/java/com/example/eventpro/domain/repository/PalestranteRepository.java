package com.example.eventpro.repository;

import com.example.eventpro.entities.Palestrante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PalestranteRepository extends JpaRepository<Palestrante, Long> {

    List<Palestrante> findByEventoId(Long eventoId);
}
