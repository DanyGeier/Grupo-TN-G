# Etapa 1: Dependencias y build
FROM eclipse-temurin:21-jdk-jammy AS deps
RUN apt-get update && apt-get install -y maven
WORKDIR /build
COPY mvnw .
COPY .mvn/ .mvn/
RUN chmod +x mvnw && \
    sed -i 's/\r$//' mvnw

# Etapa 2: Package
FROM deps AS package
WORKDIR /build
COPY ./src src/
RUN --mount=type=bind,source=pom.xml,target=pom.xml \
    --mount=type=cache,target=/root/.m2 \
    ./mvnw package -DskipTests && \
    mv target/$(./mvnw help:evaluate -Dexpression=project.artifactId -q -DforceStdout)-$(./mvnw help:evaluate -Dexpression=project.version -q -DforceStdout).jar target/app.jar

# Etapa 3: Runtime
FROM eclipse-temurin:21-jre-jammy AS final
RUN adduser \
    --disabled-password \
    --gecos "" \
    --home "/nonexistent" \
    --shell "/sbin/nologin" \
    --no-create-home \
    --uid "10001" \
    appuser
USER appuser
WORKDIR /app
COPY --from=package /build/target/app.jar app.jar
EXPOSE 8084
ENTRYPOINT ["java", "-jar", "app.jar"]

