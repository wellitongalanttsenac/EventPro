package com.example.eventpro.application.service;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.eventpro.application.DTOs.usuario.AtualizarStatusUsuarioRequest;
import com.example.eventpro.application.DTOs.usuario.AtualizarUsuarioRequestDTO;
import com.example.eventpro.application.DTOs.usuario.CriarUsuarioRequestDTO;
import com.example.eventpro.application.DTOs.usuario.UsuarioResponse;
import com.example.eventpro.application.ports.PasswordEncoderPort;
import com.example.eventpro.domain.entities.EnumStatus;
import com.example.eventpro.domain.entities.Usuario;
import com.example.eventpro.domain.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;


// Serve para criar uma instancia(um bean), igual a um componente, serve mais para semantica e legibilidade
// Bean é um objeto java gerenciado pelo springboot, facilita na instancia, injeção de dependencia...
@Service 
@RequiredArgsConstructor // tag lambok que gera o construtor com os argumentos obrigatorios que voce definil como final
public class UsuarioService {

    // Removemos o @Autowired e adicionamos um final para que ele seja atribuido apenas na instacia e nao possa ser reatribuido
    private final UsuarioRepository usuarioRepository;

    private final PasswordEncoderPort passwordEncoder;

    public List<UsuarioResponse> listarTodosOsUsuarioParaGrid() {

        return usuarioRepository.findAll()
        .stream()
        .map(UsuarioResponse::new)
        .toList();
    }

    public UsuarioResponse buscarUsuarioPorId(Long id) {

        // Procura um usuario pelo id e caso nao encontre ele lanca uma exception
        // Não precisa fazer if e fica mais limpo e direto
        return usuarioRepository
        .findById(id)
        .map(UsuarioResponse::new)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado na base"));
        
    }

    public UsuarioResponse criarUsuario(CriarUsuarioRequestDTO usuarioRequest) {

        Usuario usuario = new Usuario();
        usuario.setNome(usuarioRequest.nome());
        usuario.setCpf(usuarioRequest.cpf());
        usuario.setEmail(usuarioRequest.email());
        usuario.setSenha(passwordEncoder.encode(usuarioRequest.senha()));
        usuario.setStatus(EnumStatus.ATIVO);

        // Para o save, nao conseguimos utilizar o .map pois ele retorna um a entidade direta
        var usuarioBanco = usuarioRepository.save(usuario);
        return new UsuarioResponse(usuarioBanco);
    }

    public void atualizarStatusUsuario(Long id, AtualizarStatusUsuarioRequest statusRequest) {

        // Caso nao encontre retorna direto uma exeption
        Usuario usuarioBanco = usuarioRepository
        .findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado na base"));

        usuarioBanco.setStatus(statusRequest.status());
        usuarioRepository.save(usuarioBanco);

        return;
    }

    public UsuarioResponse atualizarUsuario(Long id, AtualizarUsuarioRequestDTO usuarioRequest) {

        Usuario usuarioBanco = usuarioRepository
        .findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado na base"));

        usuarioBanco.setStatus(usuarioRequest.status());
        usuarioBanco.setNome(usuarioRequest.nome());
        usuarioBanco.setEmail(usuarioRequest.email());
        usuarioBanco.setCpf(usuarioRequest.cpf());
        // usuarioBanco.setSenha(passwordEncoder.verifyPassword(usuarioRequest.senha(), usuarioBanco.getSenha()) ? usuarioBanco.getSenha() : passwordEncoder.encode(usuarioRequest.senha()));
        usuarioRepository.save(usuarioBanco);

        return new UsuarioResponse(usuarioBanco);
    
    }

    public void excluirUsuarioPorId(Long id) {
        
        Usuario usuarioBanco = usuarioRepository
        .findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado na base"));

        usuarioBanco.setStatus(EnumStatus.EXCLUIDO);
        usuarioRepository.save(usuarioBanco);

        return;
    }

    public void TrocarSenhaUsuarioPassandoAtual(Long id, CharSequence senhaAtual){

        Usuario usuarioBanco = usuarioRepository
        .findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario nao encontrado na base"));

        if (!passwordEncoder.verifyPassword(senhaAtual, usuarioBanco.getSenha())){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Senha invalida!");
        }

    }

    

}
