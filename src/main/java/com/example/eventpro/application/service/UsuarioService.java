package com.example.eventpro.application.service;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.server.ResponseStatusException;
import com.example.eventpro.application.DTOs.usuario.AtualizarStatusUsuarioRequest;
import com.example.eventpro.application.DTOs.usuario.AtualizarUsuarioRequestDTO;
import com.example.eventpro.application.DTOs.usuario.CriarUsuarioRequestDTO;
import com.example.eventpro.application.DTOs.usuario.UsuarioResponse;
import com.example.eventpro.domain.entities.EnumStatus;
import com.example.eventpro.domain.entities.Usuario;
import com.example.eventpro.repository.UsuarioRepository;


// Serve para criar uma instancia(um bean), igual a um componente, serve mais para semantica e legibilidade
// Bean é um objeto java gerenciado pelo springboot, facilita na instancia, injeção de dependencia...
@Service 
public class UsuarioService {

    @Autowired 
    public UsuarioRepository usuarioRepository;

    public List<UsuarioResponse> listarTodosOsUsuarioParaGrid() {

        return usuarioRepository.findAll()
        .stream()
        .map(UsuarioResponse::new)
        .toList();
    }


    public UsuarioResponse buscarUsuarioPorId(@PathVariable Long id) {

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
        usuario.setSenha(usuarioRequest.senha());
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
        usuarioBanco.setSenha(usuarioRequest.senha());
        usuarioRepository.save(usuarioBanco);

        return new UsuarioResponse(usuarioBanco);
    
    }


}
