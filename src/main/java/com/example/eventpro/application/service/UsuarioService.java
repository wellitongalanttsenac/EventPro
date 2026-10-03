package com.example.eventpro.application.service;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.eventpro.application.DTOs.UsuarioResponse;
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


}
