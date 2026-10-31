// Camada APPLICATION: casos de uso do Usuario (organizador).
package com.example.eventpro.application.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.eventpro.application.dto.usuario.AtualizarStatusUsuarioRequest;
import com.example.eventpro.application.dto.usuario.AtualizarUsuarioRequestDTO;
import com.example.eventpro.application.dto.usuario.CriarAdminRequest;
import com.example.eventpro.application.dto.usuario.CriarAdminResponse;
import com.example.eventpro.application.dto.usuario.CriarUsuarioRequestDTO;
import com.example.eventpro.application.dto.usuario.UsuarioResponse;
import com.example.eventpro.application.ports.PasswordEncoderPort;
import com.example.eventpro.domain.entities.EnumStatus;
import com.example.eventpro.domain.entities.Usuario;
import com.example.eventpro.domain.exception.ChaveAdminInvalidaException;
import com.example.eventpro.domain.repository.UsuarioRepository;
import com.example.eventpro.domain.valueobject.CPF;

import lombok.RequiredArgsConstructor;

/*
 * SERVICE de Usuario (igual ao UsuarioService da referência, sem o login, que no EventPro
 * fica no AuthService, e sem a matrícula, que aqui é a Inscricao).
 *
 * Com quem conversa:
 *  - UsuarioController (presentation) chama os métodos públicos.
 *  - UsuarioRepository para o banco.
 *  - PasswordEncoderPort para criptografar a senha (DIP: depende da interface, não do BCrypt).
 */
// Serve para criar uma instancia(um bean), igual a um componente, serve mais para semantica e legibilidade
// Bean é um objeto java gerenciado pelo springboot, facilita na instancia, injeção de dependencia...
@Service
@RequiredArgsConstructor // tag lombok que gera o construtor com os argumentos obrigatorios que voce definiu como final
public class UsuarioService {

    // Removemos o @Autowired e adicionamos um final para que ele seja atribuido apenas na instancia e nao possa ser reatribuido
    private final UsuarioRepository usuarioRepository;

    private final PasswordEncoderPort passwordEncoder;

    private final AuthService authService;

    // Mesma chave do JWT; usada aqui para liberar a criação de admin (igual à referência).
    @Value("${spring.secretkey}")
    private String secret;

    // GET /usuarios
    public List<UsuarioResponse> listarTodosOsUsuarioParaGrid() {

        return usuarioRepository.findAll()
                .stream()
                .map(UsuarioResponse::new) // Entidade -> DTO (sem senha).
                .toList();
    }

    // GET /usuarios/{id}
    public UsuarioResponse buscarUsuarioPorId(Long id) {

        // Procura um usuario pelo id e caso nao encontre ele lanca uma exception
        // Não precisa fazer if e fica mais limpo e direto
        return usuarioRepository
                .findById(id)
                .map(UsuarioResponse::new)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado na base"));
    }

    // GET /usuarios/buscarusuariologado (igual à referência): o id vem do token, não da URL.
    public UsuarioResponse buscarUsuarioLogado() {

        return buscarUsuarioPorId(authService.getUsuarioLogado().id());
    }

    // POST /usuarios
    public UsuarioResponse criarUsuario(CriarUsuarioRequestDTO usuarioRequest) {

        // A entidade recebe a senha já criptografada (ela não sabe que existe BCrypt).
        Usuario usuario = new Usuario(usuarioRequest, passwordEncoder.encode(usuarioRequest.senha()));

        // Para o save, nao conseguimos utilizar o .map pois ele retorna a entidade direta
        var usuarioBanco = usuarioRepository.save(usuario);
        return new UsuarioResponse(usuarioBanco);
    }

    // PATCH /usuarios/{id}/status
    public void atualizarStatusUsuario(Long id, AtualizarStatusUsuarioRequest statusRequest) {

        // Caso nao encontre retorna direto uma exception
        Usuario usuarioBanco = usuarioRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado na base"));

        usuarioBanco.setStatus(statusRequest.status());
        usuarioRepository.save(usuarioBanco);
    }

    // PUT /usuarios/{id}
    public UsuarioResponse atualizarUsuario(Long id, AtualizarUsuarioRequestDTO usuarioRequest) {

        Usuario usuarioBanco = usuarioRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado na base"));

        usuarioBanco.setStatus(usuarioRequest.status());
        usuarioBanco.setNome(usuarioRequest.nome());
        usuarioBanco.setEmail(usuarioRequest.email());          // Passa pela validação do setEmail da entidade.
        usuarioBanco.setCpf(new CPF(usuarioRequest.cpf()));    // Passa pela validação do value object.
        usuarioRepository.save(usuarioBanco);

        return new UsuarioResponse(usuarioBanco);
    }

    // DELETE /usuarios/{id}/excluir -> exclusão lógica (igual à referência): só muda o status.
    public void excluirUsuarioPorId(Long id) {

        Usuario usuarioBanco = usuarioRepository
                .findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado na base"));

        usuarioBanco.setStatus(EnumStatus.EXCLUIDO);
        usuarioRepository.save(usuarioBanco);
    }

    // POST /usuarios/admin (chamado pelo desktop JavaFX)
    public CriarAdminResponse criarAdmin(CriarAdminRequest criarAdminRequest) {

        // Sem a chave correta o admin nao e criado, o handler devolve 403 para o desktop
        if (!secret.equals(criarAdminRequest.secretKey())) {
            throw new ChaveAdminInvalidaException("Chave de criacao de admin invalida!");
        }

        Usuario usuarioAdminSalvar = new Usuario(criarAdminRequest, passwordEncoder.encode(criarAdminRequest.senha()));
        usuarioRepository.save(usuarioAdminSalvar);

        return new CriarAdminResponse(usuarioAdminSalvar.getId(), "Usuario Salvo com sucesso!");
    }
}
