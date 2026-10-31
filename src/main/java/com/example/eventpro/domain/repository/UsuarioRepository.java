// Camada DOMAIN: contrato de persistência do Usuario.
package com.example.eventpro.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.eventpro.domain.entities.EnumStatus;
import com.example.eventpro.domain.entities.Usuario;

import java.util.List;
import java.util.Optional;

/*
 * REPOSITÓRIO do Usuario. Interface: o Spring Data JPA gera a implementação sozinho.
 * Herdando JpaRepository<Usuario, Long> ganhamos save, findById, findAll, delete...
 *
 * Quem usa: UsuarioService, AuthService e EventoService.
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Query method: select * from usuario where status = ?
    Optional<List<Usuario>> findByStatus(EnumStatus status);

    // Query method: select * from usuario where email = ?
    // Usado no login e na recuperação de senha (o e-mail é o "username" do sistema).
    Optional<Usuario> findByEmail(String email);

}
