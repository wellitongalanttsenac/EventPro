package com.example.eventpro.repository;


import com.example.eventpro.entities.Palestrante;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PalestranteRepository extends JpaRepository<Palestrante, Long> {
}
