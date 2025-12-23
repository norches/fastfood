# syntax=docker/dockerfile:1.7

############################################
# Backend (Spring Boot)
############################################

FROM maven:3.9.9-eclipse-temurin-21 AS backend-build
WORKDIR /workspace

COPY backend/.mvn backend/.mvn
COPY backend/mvnw backend/mvnw
COPY backend/mvnw.cmd backend/mvnw.cmd
COPY backend/pom.xml backend/pom.xml
WORKDIR /workspace/backend
RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw -q -DskipTests dependency:go-offline

COPY backend/src backend/src
RUN --mount=type=cache,target=/root/.m2 \
    ./mvnw -q -DskipTests package

FROM eclipse-temurin:21-jre AS backend-runtime
WORKDIR /app
ENV JAVA_OPTS="" \
    SERVER_PORT=8080

COPY --from=backend-build /workspace/backend/target/*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=$SERVER_PORT -jar /app/app.jar"]

############################################
# Frontend (Vite build -> nginx)
############################################

FROM node:20.19-alpine AS frontend-build
WORKDIR /workspace/fastfood

COPY fastfood/package.json fastfood/package-lock.json* fastfood/pnpm-lock.yaml* fastfood/yarn.lock* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY fastfood/ ./
RUN npm run build

FROM nginx:1.27-alpine AS frontend-runtime
COPY --from=frontend-build /workspace/fastfood/dist/ /usr/share/nginx/html/
EXPOSE 80
