package com.example.back;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

import java.io.IOException;

/*
 * Controller da tela de LOGIN do desktop (login-view.fxml), igual à referência.
 * O acesso ao desktop é liberado por uma chave fixa (não passa pela API).
 */
public class LoginController {

    // Chave de acesso ao desktop (a mesma da referência).
    private String key = "asiudhakjshdkjahsdk09oq";

    // @FXML liga este atributo ao componente com fx:id="txtKey" no FXML.
    @FXML
    private TextField txtKey;

    // Chamado pelo botão "Login" (onAction="#onLoginButtonClick" no FXML).
    @FXML
    protected void onLoginButtonClick(ActionEvent event) throws IOException {

        if (txtKey.getText().equals(key)) {
            showMessage(Alert.AlertType.INFORMATION, "Login Efetuado com sucesso!");

            // Troca a tela atual pelo menu.
            FXMLLoader loader =
                    new FXMLLoader(getClass().getResource("/com/example/back/menu-view.fxml"));

            Scene scene = new Scene(loader.load());
            // Descobre a janela a partir do botão que foi clicado.
            Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
            stage.setScene(scene);

        } else {
            showMessage(Alert.AlertType.ERROR, "Erro ao Efetuar login!");
        }
    }

    // Abre uma caixa de mensagem e espera o usuário fechar (showAndWait).
    private void showMessage(Alert.AlertType type, String msg) {
        Alert alerta = new Alert(type);
        alerta.setTitle("Mensagem do Sistema!");
        alerta.setHeaderText(null);
        alerta.setContentText(msg);
        alerta.showAndWait();
    }

}
