// Camada DOMAIN: contrato de persistência do Palestrante.
package com.example.eventpro.domain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.eventpro.domain.entities.Palestrante;

// REPOSITÓRIO do Palestrante. Quem usa: PalestranteService.
@Repository
public interface PalestranteRepository extends JpaRepository<Palestrante, Long> {

    // Todos os palestrantes de um evento: select * from palestrante where evento_id = ?
    List<Palestrante> findByEventoId(Long eventoId);
}
