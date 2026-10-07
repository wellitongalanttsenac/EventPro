package com.example.eventpro.application.ports;

// Definindo o contato entre a implementação concreta da criptografia com a camada service
// Evitando quebrar a regra DIP Principio da inversao de dependencia
public interface PasswordEncoderPort {
    // Char Sequence é uma interface do java que aceita varios tipos de sequencias de caracteres
    // String é apenas um das que esta implementada em CharSequence, porem ela é imutavel, depois que definida na memoria, ela so sera limpa até que o garbage collector faça isso
    // É bom pois faz com que seja flexivel, podendo implementar outros tipos, tipos mutaveis, mais rapidos para serem limpados
    String encode(CharSequence rawPassword);
    boolean verifyPassword(CharSequence rawPassord, String encryptedPassword);
}
