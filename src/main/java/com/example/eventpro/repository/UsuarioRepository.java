package com.example.eventpro.repository;

import com.example.eventpro.entities.EnumStatus;
import com.example.eventpro.entities.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    boolean existsUsuarioByEmailAndSenha(String email, String senha);

    Optional<List<Usuario>> findByStatus(EnumStatus status);

    Optional<Usuario> findByEmail(String email);

}
