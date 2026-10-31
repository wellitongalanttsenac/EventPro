// Camada DOMAIN: entidades e regras de negócio.
package com.example.eventpro.domain.entities;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.example.eventpro.application.dto.usuario.CriarAdminRequest;
import com.example.eventpro.application.dto.usuario.CriarUsuarioRequestDTO;
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

/*
 * ENTIDADE Usuario = o ORGANIZADOR de eventos do EventPro.
 *
 * Quem usa:
 *  - UsuarioService (cadastro, edição, status), AuthService (login e senha),
 *  - Evento (todo evento tem um organizador), Token (todo token pertence a um usuário).
 *
 * Por que "implements UserDetails" (igual à referência):
 *  UserDetails é a interface que o Spring Security usa para representar "um usuário do sistema".
 *  Implementando, a entidade sabe dizer quais permissões (roles) tem, e o UsuarioLogado
 *  usa isso para o Spring decidir o que o usuário pode acessar.
 *
 *  Observação de DDD: o ideal "puro" seria o domínio não conhecer nenhum framework.
 *  O professor optou por essa ligação direta com o Spring Security por simplicidade,
 *  e mantemos igual para ficar no mesmo padrão da disciplina.
 */
@Entity
@Data               // Lombok: getters/setters de todos os campos.
@NoArgsConstructor  // Construtor vazio exigido pelo JPA.
@AllArgsConstructor
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    // CPF é um VALUE OBJECT (DDD): não tem id próprio, vale pelo seu conteúdo e
    // se valida sozinho no construtor. @Embedded grava o campo dele dentro da tabela usuario.
    @Embedded
    private CPF cpf;

    // Sempre guardada criptografada com BCrypt (quem criptografa é o service, via PasswordEncoderPort).
    private String senha;

    private String email;

    // @Enumerated(STRING) grava o NOME do enum ("ATIVO") e não a posição (0),
    // assim reordenar o enum não bagunça os dados já salvos.
    @Enumerated(EnumType.STRING)
    private EnumStatus status;

    // Papel do usuário para o Spring Security. O prefixo "ROLE_" é a convenção do Spring.
    private String role = "ROLE_USER";

    // Regra de negócio dentro da entidade (DDD: entidade rica, não só um saco de dados):
    // não deixa existir usuário com e-mail sem "@".
    public void setEmail(String email) {
        if (email != null && !email.isEmpty() && !email.contains("@")) {
            throw new IllegalArgumentException("Email Invalido!"); // Vira 400 no GlobalExceptionHandler.
        }
        this.email = email;
    }

    // Construtor de ORGANIZADOR comum (POST /usuarios).
    // A senha chega já criptografada pelo UsuarioService: a entidade não conhece o BCrypt
    // (SRP - cada classe com uma responsabilidade).
    public Usuario(CriarUsuarioRequestDTO usuarioRequest, String senhaCriptografada) {
        this.setCpf(new CPF(usuarioRequest.cpf()));   // Se o CPF for inválido, o próprio value object lança exceção.
        this.setNome(usuarioRequest.nome());
        this.setSenha(senhaCriptografada);
        this.setEmail(usuarioRequest.email());        // Passa pela validação do setEmail acima.
        this.setRole("ROLE_USER");
        this.setStatus(EnumStatus.ATIVO);             // Todo cadastro nasce ativo.
    }

    // Construtor de ADMIN (POST /usuarios/admin, chamado pelo desktop JavaFX).
    public Usuario(CriarAdminRequest criarAdminRequest, String senhaCriptografada) {
        this.setCpf(new CPF(criarAdminRequest.cpf()));
        this.setNome(criarAdminRequest.nome());
        this.setSenha(senhaCriptografada);
        this.setEmail(criarAdminRequest.email());
        this.setRole("ROLE_ADMIN");                   // Única diferença para o organizador comum.
        this.setStatus(EnumStatus.ATIVO);
    }

    // ===== Métodos exigidos pela interface UserDetails =====

    // Lista de permissões do usuário. Transformamos o texto da role em um
    // SimpleGrantedAuthority, que é o tipo que o Spring Security entende.
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(this.role));
    }

    // O Spring chama de "password" o que aqui é a senha (hash BCrypt).
    @Override
    public String getPassword() {
        return this.senha;
    }

    // O Spring chama de "username" o identificador do login, que no EventPro é o e-mail.
    @Override
    public String getUsername() {
        return this.email;
    }
}
