package com.example.eventpro.application.dto.usuario;

// DTO de saída do esqueci-senha: o token que autoriza a troca de senha.
// (Em produção ele iria por e-mail, aqui é devolvido direto para fins de estudo.)
public record EsqueciSenhaResponse(String tokenRecuperacao) {
}
