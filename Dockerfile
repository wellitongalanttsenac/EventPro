FROM maven:3.9.8-eclipse-temurin-21-jammy AS builder
LABEL authors="welliton.caetano"

WORKDIR /app

COPY . .

RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

COPY --from=builder /app/target/spring-boot-starter-parent-4.1.0-SNAPSHOT.jar .

EXPOSE 8080

ENTRYPOINT ["java", "-jar","spring-boot-starter-parent-4.1.0-SNAPSHOT.jar"]