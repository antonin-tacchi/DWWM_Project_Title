# 👥 Social Service

Community and user interaction microservice for the **Clap!** platform.

---

## Overview

Social Service manages all user-generated interactions.

It handles content created by authenticated users and provides community features.

Responsibilities include:

- Favorites
- Playlists
- Comments
- Ratings
- User interaction

---

## Responsibilities

Main features:

- Add favorites
- Remove favorites
- Create playlists
- Manage playlists
- Post comments
- Rate media
- Retrieve social content

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Java 17 | Language |
| Spring Boot | Framework |
| OpenFeign | Communication |
| Consul | Discovery |
| JWT Headers | User identity |
| Actuator | Monitoring |

---

## Architecture

```text
Gateway
↓
social-service
↓
db-service
```

User identity is forwarded by the Gateway.

The service trusts:

```text
X-User-Id
X-User-Role
```

No JWT decoding occurs inside the service.

---

## Running Locally

Run:

```bash
./mvnw spring-boot:run
```

Port:

```text
9010
```

---

## Main Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /favorites | Add favorite |
| POST | /lists | Create playlist |
| POST | /comments | Add comment |
| POST | /ratings | Add rating |

Authentication required.

---

## Security

Protected by:

- Gateway JWT validation
- Forwarded headers
- Role-aware access

Private routes are inaccessible without authentication.

---

## Dependencies

Depends on:

- db-service
- consul

---

## Project Structure

```text
social/
├── src/
├── pom.xml
└── Dockerfile
```

---

## Author

Antonin Tacchi