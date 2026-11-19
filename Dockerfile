FROM maven:3.9.8-eclipse-temurin-21-jammy
LABEL authors="welliton.caetano"

WORKDIR /app

COPY src .

RUN mvn clean package -DskipTests

WORKDIR /app

COPY --from=builder /app/target/spring-boot-starter-parent-4.1.0-SNAPSHOT.jar .

EXPOSE 8080

ENTRYPOINT ["java", "-jar","spring-boot-starter-parent-4.1.0-SNAPSHOT.jar"]