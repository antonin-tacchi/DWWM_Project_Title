# ── Stage 1 : build ──────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17-alpine AS build

WORKDIR /build

# 1. Copy ONLY pom.xml first → cette couche est en cache tant que pom.xml ne change pas
COPY pom.xml .

# 2. Télécharge toutes les dépendances → en cache tant que pom.xml ne change pas
#    Les rebuilds après changement de code sautent entièrement cette étape (~2 min gagnées)
RUN mvn dependency:go-offline -q

# 3. Copie le code source (change souvent)
COPY src ./src

# 4. Compile → rapide, les dépendances sont déjà là
RUN mvn package -DskipTests -q

# ── Stage 2 : runtime ─────────────────────────────────────────────
# JRE Alpine = ~180 MB vs ~400 MB pour openjdk:17-jdk-slim
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

COPY --from=build /build/target/auth-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8090

ENTRYPOINT ["java", "-jar", "app.jar"]
