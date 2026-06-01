# 🎬 Movies Service

Movie and TV catalog microservice for the **Clap!** platform.

This service acts as a proxy between the platform and the **TMDB API**.

---

## Overview

Movies Service handles all movie and TV discovery features.

It centralizes communication with TMDB and exposes clean platform endpoints.

Responsibilities include:

- Movie catalog
- TV catalog
- Search
- Discovery
- Filtering
- Trending content
- TMDB integration
- Cached requests

---

## Responsibilities

Main features:

- Fetch movies
- Fetch TV shows
- Search media
- Popular content
- Upcoming releases
- Genre filtering
- External API integration

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Java 17 | Language |
| Spring Boot | Framework |
| OpenFeign | Inter-service communication |
| TMDB API | Movie database |
| MongoDB | Cache layer |
| Consul | Discovery |
| Actuator | Monitoring |

---

## Architecture

```text
Gateway
↓
movies-service
↓
TMDB API
↓
MongoDB cache
```

The service reduces direct frontend exposure to external APIs.

---

## Environment Variables

| Variable | Description |
|---|---|
| TMDB_API_KEY | TMDB API access key |

Example:

```env
TMDB_API_KEY=your_tmdb_key
```

---

## Running Locally

Run:

```bash
./mvnw spring-boot:run
```

Port:

```text
9000
```

---

## API Examples

Common endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | /movies/popular | Popular movies |
| GET | /movies/{id} | Movie details |
| GET | /tv/{id} | TV details |

---

## Cache Layer

Movies Service uses:

```text
MongoDB
```

Purpose:

- Reduce TMDB calls
- Improve performance
- Temporary caching

Mongo container:

```text
27017
```

---

## Dependencies

Depends on:

- db-service
- consul
- mongodb

---

## Project Structure

```text
movies/
├── src/
├── pom.xml
└── Dockerfile
```

---

## Author

Antonin Tacchi