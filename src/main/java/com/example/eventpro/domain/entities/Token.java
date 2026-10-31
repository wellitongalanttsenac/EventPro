// Camada DOMAIN (domínio): aqui ficam as entidades, o "coração" do sistema.
package com.example.eventpro.domain.entities;

// Anotações do JPA (Jakarta Persistence): dizem ao Hibernate como transformar esta classe em tabela.
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
// Lombok: gera em tempo de compilação o código repetitivo (getters, setters, construtores).
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/*
 * ENTIDADE Token (igual à referência do professor)
 *
 * O que é: o registro de cada JWT emitido no login, salvo na tabela "token".
 *
 * Por que existe: o JWT sozinho só prova que foi assinado com a nossa chave.
 * Guardando o token no banco, o JwtFilter consegue confirmar que aquele token
 * foi realmente emitido por esta API e descobrir DE QUEM ele é (o Usuario ligado a ele).
 *
 * Com quem conversa:
 *  - TokenService cria (new Token(...)) e salva pelo TokenRepository no login.
 *  - TokenService busca pelo TokenRepository em cada requisição (verificarToken).
 *
 * Conceito DDD: é uma ENTIDADE porque tem identidade própria (id) e ciclo de vida
 * (é criada no login e consultada depois).
 */
@Entity                 // Marca a classe como entidade JPA (vira uma tabela).
@Data                   // Lombok: getters, setters, equals, hashCode e toString.
@NoArgsConstructor      // Lombok: construtor vazio, obrigatório para o JPA instanciar a entidade ao ler do banco.
@AllArgsConstructor     // Lombok: construtor com todos os campos.
@Table(name = "token")  // Nome da tabela no PostgreSQL.
public class Token {

    @Id                                                 // Chave primária.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // O banco gera o id sozinho (auto incremento).
    private Long id;

    // O próprio JWT. O padrão do JPA é varchar(255); um e-mail grande deixaria o token
    // maior que isso, então reservamos 512 caracteres para não estourar no insert.
    @Column(length = 512)
    private String token;

    // Quando o token foi emitido (útil para auditoria).
    private LocalDateTime dataCadastro;

    // Relacionamento N:1 -> vários tokens podem pertencer ao mesmo Usuario (um por login).
    // @JoinColumn cria a coluna "usuario_id" (chave estrangeira) apontando para usuario.id.
    @ManyToOne
    @JoinColumn(name = "usuario_id", referencedColumnName = "id")
    private Usuario usuario;

    // Construtor usado pelo TokenService: recebe o JWT e o dono,
    // e a própria entidade registra a data de criação (a regra fica dentro do domínio).
    public Token(String token, Usuario usuario) {
        this.setToken(token);
        this.setUsuario(usuario);
        this.setDataCadastro(LocalDateTime.now());
    }
}
