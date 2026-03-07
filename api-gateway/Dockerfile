# Usar una imagen base de Java 17
FROM eclipse-temurin:17-jdk-alpine
# Definir el archivo JAR (ajustar nombre según el servicio)
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} app.jar
# Ejecutar la aplicación
ENTRYPOINT ["java","-jar","/app.jar"]