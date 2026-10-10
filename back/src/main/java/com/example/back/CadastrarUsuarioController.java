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

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

public class CadastrarUsuarioController {

    @FXML
    private TextField txtNome;

    @FXML
    private TextField txtCpf;

    @FXML
    private TextField txtEmail;

    @FXML
    private PasswordField txtSenha;

    @FXML
    protected void onSalvarButtonClick(ActionEvent event) throws IOException {
        if (!txtNome.getText().isEmpty() && !txtCpf.getText().isEmpty() && !txtEmail.getText().isEmpty() && !txtSenha.getText().isEmpty()) {
            showMessage(Alert.AlertType.INFORMATION, "Usuário foi salvo com sucesso!");

            FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/back/menu-view.fxml"));

            Scene scene = new Scene(loader.load());
            Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();

            stage.setScene(scene);
        } else {
            showMessage(Alert.AlertType.ERROR, "Erro ao salvar usuário!");
        }
    }

    private void showMessage(Alert.AlertType type, String msg) {
        Alert alerta = new Alert(type);

        alerta.setTitle("Mensagem do sistema.");
        alerta.setHeaderText(null);
        alerta.setContentText(msg);

        alerta.showAndWait();
    }


    // Metodo para salvar usuario
    @FXML
    public void salvar(ActionEvent event) throws Exception {
        //Validar Dados

        String jsonRequest = String.format("{\n" +
                        "  \"nome\": \"%s\",\n" +
                        "  \"email\": \"%s\",\n" +
                        "  \"senha\": \"%s\",\n" +
                        "  \"cpf\": \"%s\",\n" +
                        "  \"secretKey\": \"%s\"\n" +
                        "}", txtNome.getText(),
                txtEmail.getText(),
                txtSenha.getText(),
                txtCpf.getText(),
                "sakjbhaskjcdhaiubshLKVAShfbdw68asd65d");
        int respostaApi = executaMetodoAPI("http://localhost:8080/usuarios/admin",jsonRequest,"POST");


        if(respostaApi ==200){
            showMessage(Alert.AlertType.INFORMATION,"Usuario salv com sucesso!");
            voltarParaMenu(event);

        }else {
            showMessage(Alert.AlertType.ERROR,"Erro ao salvar usuário!");
        }

        voltarParaMenu(event);
    }

    @FXML
    public void sair(ActionEvent event) throws IOException {
        voltarParaMenu(event);
    }


    private void voltarParaMenu(ActionEvent event) throws IOException {
        FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/back/menu-view.fxml"));

        Scene scene = new Scene(loader.load());
        Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();

        stage.setScene(scene);
    }


    //Metodo para exeutar a api passando a url json e protocolo HTTp
    private int executaMetodoAPI(String url,String json,String protocoloHttp)
            throws Exception {


        URL urlAPI = new URL(url);
        HttpURLConnection connection = (HttpURLConnection) urlAPI.openConnection();
        connection.setRequestMethod(protocoloHttp);
        connection.setDoOutput(true);


        if(!json.isEmpty()){
            connection.setRequestProperty("Content-Type","application/json");

            try (OutputStream os = connection.getOutputStream()){
                os.write(json.getBytes());
            }

        }

//        var  br = new BufferedReader(new InputStreamReader((connection.getInputStream())));
//       var sb = new StringBuilder();
//        String output;
//        while ((output = br.readLine()) != null) {
//            sb.append(output);
//        }
//
//        var retornoBody = sb.toString();

        return connection.getResponseCode();

    }
}
