package com.example.back;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

// Regras do cadastro de admin separadas da tela, assim podem ser testadas sem abrir o JavaFX
public class CadastroAdmin {

    private static final Pattern MENSAGEM_API = Pattern.compile("\"mensagem\"\\s*:\\s*\"([^\"]*)\"");

    public static List<String> validar(String nome, String cpf, String email, String senha) {

        List<String> erros = new ArrayList<>();

        if (estaVazio(nome)) {
            erros.add("Informe o nome.");
        }

        if (estaVazio(cpf)) {
            erros.add("Informe o CPF.");
        } else if (cpf.replaceAll("\\D", "").length() != 11) {
            erros.add("O CPF precisa ter 11 dígitos.");
        }

        if (estaVazio(email)) {
            erros.add("Informe o e-mail.");
        } else if (!email.contains("@")) {
            erros.add("Informe um e-mail válido.");
        }

        if (estaVazio(senha)) {
            erros.add("Informe a senha.");
        }

        return erros;
    }

    // Mesmo formato do CriarAdminRequest da API
    public static String montarJson(String nome, String cpf, String email, String senha, String secretKey) {

        return "{\"nome\":\"" + escapar(nome) + "\","
                + "\"email\":\"" + escapar(email) + "\","
                + "\"senha\":\"" + escapar(senha) + "\","
                + "\"cpf\":\"" + escapar(cpf) + "\","
                + "\"secretKey\":\"" + escapar(secretKey) + "\"}";
    }

    public static String mensagemDeErro(int statusHttp, String corpoResposta) {

        if (statusHttp == 403) {
            return "Chave de criação de admin inválida! Confira a secretKey da API.";
        }

        // A API devolve o ErroResponse com o campo "mensagem" (ex: CPF Invalido!, Email Invalido!)
        if (corpoResposta != null) {
            Matcher mensagem = MENSAGEM_API.matcher(corpoResposta);
            if (mensagem.find()) {
                return mensagem.group(1);
            }
        }

        return "Erro ao salvar usuário! (HTTP " + statusHttp + ")";
    }

    private static boolean estaVazio(String valor) {
        return valor == null || valor.isBlank();
    }

    private static String escapar(String valor) {
        return valor.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
