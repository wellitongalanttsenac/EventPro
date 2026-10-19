package com.example.eventpro.domain.entities;

import com.example.eventpro.application.DTOs.usuario.CriarAdminRequest;
import com.example.eventpro.application.DTOs.usuario.CriarUsuarioRequestDTO;
import com.example.eventpro.domain.valueobject.CPF;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// Organizador do sistema EventPro
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    @Embedded
    private CPF cpf;
    private String senha;
    private String email;
    @Enumerated(EnumType.STRING)
    private EnumStatus status;
    private String role = "ROLE_USER";

    public void setEmail(String email) {
        if(email != null && !email.isEmpty() && !email.contains("@")){
            throw new IllegalArgumentException("Email Invalido!");
        }
        this.email = email;
    }

    // A senha chega ja criptografada pelo service, a entidade nao conhece o BCrypt
    public Usuario(CriarUsuarioRequestDTO usuarioRequest, String senhaCriptografada) {
        this.setCpf(new CPF(usuarioRequest.cpf()));
        this.setNome(usuarioRequest.nome());
        this.setSenha(senhaCriptografada);
        this.setEmail(usuarioRequest.email());
        this.setRole("ROLE_USER");
        this.setStatus(EnumStatus.ATIVO);
    }

    public Usuario(CriarAdminRequest criarAdminRequest, String senhaCriptografada) {
        this.setCpf(new CPF(criarAdminRequest.cpf()));
        this.setNome(criarAdminRequest.nome());
        this.setSenha(senhaCriptografada);
        this.setEmail(criarAdminRequest.email());
        this.setRole("ROLE_ADMIN");
        this.setStatus(EnumStatus.ATIVO);
    }
}
