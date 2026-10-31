// Camada APPLICATION: "ports" são interfaces que a aplicação define e a infra implementa.
package com.example.eventpro.application.ports;

/*
 * PORTA de criptografia de senha (padrão Ports and Adapters / Arquitetura Hexagonal).
 *
 * Definindo o contrato entre a implementação concreta da criptografia e a camada service,
 * evitando quebrar o DIP (Princípio da Inversão de Dependência - o "D" do SOLID):
 *  - os services (UsuarioService, AuthService) dependem DESTA interface;
 *  - quem implementa é o BcryptPasswordEncoderAdapter, lá na camada infra.
 * Se um dia trocar o BCrypt por outro algoritmo, só muda o adapter; nenhum service é tocado
 * (OCP - aberto para extensão, fechado para modificação).
 *
 * A referência do professor salva a senha em texto puro; aqui melhoramos guardando só o hash.
 */
public interface PasswordEncoderPort {
    // CharSequence é uma interface do java que aceita varios tipos de sequencias de caracteres
    // String é apenas um das que esta implementada em CharSequence, porem ela é imutavel, depois que definida na memoria, ela so sera limpa até que o garbage collector faça isso
    // É bom pois faz com que seja flexivel, podendo implementar outros tipos, tipos mutaveis, mais rapidos para serem limpados

    // Recebe a senha pura e devolve o hash para salvar no banco.
    String encode(CharSequence rawPassword);

    // Compara a senha digitada com o hash salvo (true = confere).
    boolean verifyPassword(CharSequence rawPassord, String encryptedPassword);
}
