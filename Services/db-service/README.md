# 🗄️ DB Service

Persistence microservice for the **Clap!** platform.

The DB Service centralizes all database access and acts as the persistence layer for the platform.

---

## Overview

Unlike traditional architectures where each service owns its database layer, **db-service** centralizes persistence responsibilities.

Other services communicate with it through **OpenFeign**.

Responsibilities include:

- Users
- Comments
- Ratings
- Lists
- Favorites
- Activity logs
- Data persistence

---

## Responsibilities

Main features:

- Centralized persistence
- CRUD operations
- Data validation
- Database exposure through REST endpoints
- Shared data access for microservices

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Java 17 | Backend language |
| Spring Boot | Framework |
| Spring Data JPA | Persistence |
| H2 Database | Embedded database |
| Flyway | Schema migration |
| OpenFeign | Service communication |
| Consul | Service discovery |
| Actuator | Health monitoring |
| JUnit + Mockito | Testing |

---

## Architecture

```text
auth-service
movies-service
social-service
notifications-service
        ↓
     db-service
        ↓
      H2 DB
```

db-service acts as the platform persistence layer.

---

## Database

Database type:

```text
H2 (file mode)
```

Persistent Docker volume:

```text
db_data
```

This allows data persistence between container restarts.

---

## Running Locally

Run:

```bash
./mvnw spring-boot:run
```

Port:

```text
8060
```

---

## Health Check

Actuator endpoint:

```text
/actuator/health
```

Example:

```text
http://localhost:8060/actuator/health
```

---

## Testing

Run:

```bash
./mvnw test
```

Current tests include:

- CommentControllerTest
- RatingControllerTest

---

## Dependencies

Depends on:

- consul

Used by:

- auth-service
- movies-service
- social-service
- notifications-service

---

## Project Structure

```text
db-service/
├── src/
├── pom.xml
└── Dockerfile
```

---

## Author

Antonin Tacchi