# 🔔 Notifications Service

Notification microservice for the **Clap!** platform.

---

## Overview

Notifications Service manages platform notifications and user alerts.

It centralizes messaging and event delivery.

Responsibilities include:

- User notifications
- Badge alerts
- Release notifications
- Event persistence

---

## Responsibilities

Main features:

- Create notifications
- Retrieve notifications
- Mark notifications as read
- Manage notification history
- Deliver platform events

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Java 17 | Language |
| Spring Boot | Framework |
| OpenFeign | Communication |
| Consul | Discovery |
| Actuator | Monitoring |

---

## Architecture

```text
Gateway
↓
notifications-service
↓
db-service
```

Notification data is persisted through db-service.

---

## Running Locally

Run:

```bash
./mvnw spring-boot:run
```

Port:

```text
9020
```

---

## API

Example endpoint:

| Method | Endpoint | Description |
|---|---|---|
| GET | /notifications | User notifications |

Authentication required.

---

## Notification Flow

```text
Event triggered
↓
Notification created
↓
Stored through db-service
↓
Retrieved by frontend
```

Examples:

- Badge unlocked
- New release
- User activity

---

## Security

Protected routes require:

- Valid JWT
- Gateway authorization
- User headers

---

## Dependencies

Depends on:

- db-service
- consul

---

## Project Structure

```text
notifications/
├── src/
├── pom.xml
└── Dockerfile
```

---

## Author

Antonin Tacchi