# 🔐 Auth Service

Authentication and administration microservice for the **Clap!** platform.

---

## Overview

The Auth Service manages:

- User authentication
- JWT generation
- Password security
- Account management
- Admin permissions

Unlike a traditional monolith, this service **does not access the database directly**.

Persistence is delegated to **db-service** through OpenFeign.

---

## Responsibilities

Main features:

- Register users
- Login
- Generate JWT
- Validate credentials
- Hash passwords
- Manage admin actions
- Communicate with db-service

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Java 17 | Language |
| Spring Boot | Framework |
| Spring Security | Security |
| JWT (jjwt) | Authentication |
| BCrypt | Password hashing |
| OpenFeign | Service communication |
| Consul | Discovery |
| MapStruct | DTO mapping |
| Swagger | API docs |
| JUnit + Mockito | Testing |

---

## Architecture

```text
Gateway
↓
auth-service
↓
db-service
```

The service communicates with the database indirectly.

---

## Environment Variables

| Variable | Description |
|---|---|
| JWT_SECRET | JWT signing secret |
| JWT_EXPIRATION | Token lifetime |
| TURNSTILE_SECRET_KEY | Cloudflare Turnstile secret key |
| TURNSTILE_EXPECTED_ACTION | Expected Turnstile action, defaults to `register` |
| TURNSTILE_EXPECTED_HOSTNAME | Optional hostname check |

Example:

```env
JWT_SECRET=your_secret
JWT_EXPIRATION=86400000
TURNSTILE_SECRET_KEY=your_cloudflare_turnstile_secret_key
TURNSTILE_EXPECTED_ACTION=register
```

Local Turnstile test values:

```env
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
TURNSTILE_EXPECTED_ACTION=test
```

---

## API

Main endpoints:

| Method | Endpoint | Description |
|---|---|---|
| POST | /auth/register | Create account after Turnstile validation |
| POST | /auth/login | Login |
| GET | /admin/** | Admin endpoints |

---

## Authentication Flow

Login:

```text
User credentials
↓
Credential validation
↓
Password verification
↓
JWT generation
↓
Response:
token + user
```

---

## Running Locally

Run:

```bash
./mvnw spring-boot:run
```

Port:

```text
8090
```

---

## Swagger

Swagger UI:

```text
http://localhost:8090/swagger-ui/index.html
```

---

## Testing

Run:

```bash
./mvnw test
```

Coverage includes:

- JwtUtilTest
- AuthServiceTest
- AdminControllerTest

---

## Dependencies

Auth service depends on:

- db-service
- consul

---

## Project Structure

```text
auth/
├── src/
├── pom.xml
└── Dockerfile
```

---

## Author

Antonin Tacchi
