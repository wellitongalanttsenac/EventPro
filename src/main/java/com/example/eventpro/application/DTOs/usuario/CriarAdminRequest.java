package com.example.eventpro.application.DTOs.usuario;

public record CriarAdminRequest(String nome,String email,String senha,String cpf, String secretKey) {
}
