// Descritor de módulo do Java (Java Platform Module System), igual à referência.
module com.example.back {
    requires javafx.controls;   // Botões, campos de texto, alertas.
    requires javafx.fxml;       // Leitura dos arquivos .fxml.
    requires java.desktop;
    requires javafx.graphics;   // Stage, Scene.

    // O FXMLLoader usa reflexão para preencher os atributos @FXML dos controllers,
    // por isso o pacote precisa ser "aberto" para o javafx.fxml.
    opens com.example.back to javafx.fxml;
    exports com.example.back;
}
