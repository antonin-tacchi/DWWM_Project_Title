FROM maven:3.9-eclipse-temurin-17-alpine AS build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17.0.1-jdk-slim

LABEL maintainer=antonintacchi

COPY --from=build /target/auth-0.0.1-SNAPSHOT.jar auth-0.0.1-SNAPSHOT.jar

EXPOSE 8090

ENTRYPOINT ["java", "-jar", "/auth-0.0.1-SNAPSHOT.jar"]