package com.example.back;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;

/*
 * Controller da tela de CADASTRO DE ADMIN (cadastro-usuario-view.fxml), igual à referência.
 *
 * Fluxo: valida os campos -> monta o JSON -> POST http://localhost:8080/usuarios/admin
 * -> mostra sucesso ou o erro devolvido pela API.
 *
 * Com quem conversa: CadastroAdmin (validação e JSON, sem JavaFX, por isso dá para testar)
 * e a API Spring (rota pública /usuarios/admin, protegida pela secretKey).
 */
public class UsuarioController {

    // Campos da tela, ligados pelo fx:id do FXML.
    @FXML
    private TextField txtNome;

    @FXML
    private TextField txtCpf;

    @FXML
    private TextField txtEmail;

    @FXML
    private PasswordField txtSenha; // PasswordField esconde o texto digitado.

    // Botão "Salvar".
    @FXML
    public void salvarUsuario(ActionEvent event) throws Exception {

        //Validar Dados antes de chamar a API
        List<String> erros = CadastroAdmin.validar(txtNome.getText(), txtCpf.getText(), txtEmail.getText(), txtSenha.getText());

        if (!erros.isEmpty()) {
            showMessage(Alert.AlertType.WARNING, String.join("\n", erros));
            return;
        }

        // Mesmo JSON do CriarAdminRequest da API. A secretKey é a spring.secretkey do application.properties.
        String jsonRequest = CadastroAdmin.montarJson(txtNome.getText().trim(),
                txtCpf.getText().trim(),
                txtEmail.getText().trim(),
                txtSenha.getText(),
                "sakjbhaskjcdhaiubshLKVAShfbdw68asd65d");

        RespostaApi respostaApi;
        try {
            respostaApi = executaMetodoAPI("http://localhost:8080/usuarios/admin", jsonRequest, "POST");
        } catch (IOException e) {
            // API desligada ou fora do ar.
            showMessage(Alert.AlertType.ERROR, "Não foi possível conectar à API em localhost:8080. Verifique se o back end está rodando.");
            return;
        }

        if (respostaApi.status() == 200) {
            showMessage(Alert.AlertType.INFORMATION, "Usuario salvo com sucesso!");
            voltar(event);

        } else {
            showMessage(Alert.AlertType.ERROR, CadastroAdmin.mensagemDeErro(respostaApi.status(), respostaApi.corpo()));
        }

    }

    // Botão "Voltar": volta para o menu.
    @FXML
    public void voltar(ActionEvent event) throws IOException {
        FXMLLoader loader =
                new FXMLLoader(getClass().getResource("/com/example/back/menu-view.fxml"));

        Scene scene = new Scene(loader.load());
        Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
        stage.setScene(scene);
    }

    // Status HTTP e corpo da resposta, o corpo traz a mensagem de erro da API (ErroResponse)
    private record RespostaApi(int status, String corpo) {
    }

    // Faz a chamada HTTP com a classe nativa do Java (HttpURLConnection), igual à referência.
    private RespostaApi executaMetodoAPI(String url, String json, String protocoloHttp)
            throws IOException {

        URL urlAPI = URI.create(url).toURL();
        HttpURLConnection connection = (HttpURLConnection) urlAPI.openConnection();
        connection.setRequestMethod(protocoloHttp); // "POST"
        connection.setDoOutput(true);               // Vamos enviar um corpo.

        if (!json.isEmpty()) {
            connection.setRequestProperty("Content-Type", "application/json");

            // try-with-resources: fecha o stream sozinho no final.
            try (OutputStream os = connection.getOutputStream()) {
                os.write(json.getBytes(StandardCharsets.UTF_8));
            }
        }

        int status = connection.getResponseCode(); // Dispara a requisição e lê o status.

        // Em erro (4xx/5xx) o corpo vem no errorStream
        InputStream corpo = status >= 400 ? connection.getErrorStream() : connection.getInputStream();
        if (corpo == null) {
            return new RespostaApi(status, "");
        }

        // Lê o corpo da resposta linha a linha.
        try (var br = new BufferedReader(new InputStreamReader(corpo, StandardCharsets.UTF_8))) {
            var sb = new StringBuilder();
            String output;
            while ((output = br.readLine()) != null) {
                sb.append(output);
            }
            return new RespostaApi(status, sb.toString());
        }
    }

    private void showMessage(Alert.AlertType type, String msg) {
        Alert alerta = new Alert(type);
        alerta.setTitle("Mensagem do Sistema!");
        alerta.setHeaderText(null);
        alerta.setContentText(msg);
        alerta.showAndWait();
    }

}
