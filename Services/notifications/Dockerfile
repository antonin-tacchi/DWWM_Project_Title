FROM maven:3.9-eclipse-temurin-17-alpine AS build
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17.0.1-jdk-slim

LABEL maintainer=antonintacchi

COPY --from=build /target/notifications-0.0.1-SNAPSHOT.jar notifications-0.0.1-SNAPSHOT.jar

EXPOSE 9020

ENTRYPOINT ["java", "-jar", "/notifications-0.0.1-SNAPSHOT.jar"]