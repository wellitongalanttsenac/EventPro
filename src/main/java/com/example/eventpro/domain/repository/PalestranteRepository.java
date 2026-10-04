package com.example.eventpro.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.eventpro.domain.entities.Palestrante;

@Repository
public interface PalestranteRepository extends JpaRepository<Palestrante, Long> {

    List<Palestrante> findByEventoId(Long eventoId);
}
