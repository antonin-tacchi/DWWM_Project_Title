# 🌐 Gateway Service

Spring Cloud Gateway for the **Clap!** platform.

The Gateway acts as the **single entry point** for all frontend and API traffic.

---

## Overview

The gateway centralizes:

- Routing
- JWT validation
- Security filtering
- Request forwarding
- Service discovery
- Header injection

It prevents direct access to internal microservices.

---

## Responsibilities

Main responsibilities:

- Route requests
- Validate JWT tokens
- Extract user identity
- Inject headers
- Protect private routes
- Discover services using Consul
- Provide resilient routing

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Java 17 | Backend language |
| Spring Cloud Gateway | Reactive routing |
| Consul Discovery | Service registry |
| JWT | Token validation |
| Resilience4j | Circuit breaker |
| Spring Boot | Framework |

---

## Architecture

```text
Frontend
↓
Gateway :8080
↓
Microservices
```

Gateway is responsible for access control.

---

## Security Flow

Public routes:

```text
/auth/**
/movies/**
/tv/**
```

Protected routes:

```text
/comments
/favorites
/lists
/ratings
/notifications
/admin/**
```

Authentication flow:

```text
JWT received
↓
Validate signature
↓
Extract claims
↓
Inject:

X-User-Id
X-User-Role
↓
Forward request
```

Services do not decode JWT again.

---

## Environment Variables

| Variable | Description |
|---|---|
| JWT_SECRET | JWT verification secret |

---

## Running Locally

Run:

```bash
./mvnw spring-boot:run
```

Port:

```text
8080
```

---

## Testing

Run:

```bash
./mvnw test
```

Current tests:

- JwtUtilGatewayTest

---

## Dependencies

Gateway depends on:

- consul
- auth-service
- movies-service
- social-service
- notifications-service

---

## Project Structure

```text
gateway/
├── src/
├── pom.xml
└── Dockerfile
```

---

## Author

Antonin Tacchi