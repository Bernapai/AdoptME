# 📝 Adoption Service

Este microservicio permite gestionar las **solicitudes de adopción** realizadas por los usuarios en AdoptMe.

## 📌 Funcionalidades

- Crear nuevas solicitudes de adopción
- Consultar solicitudes por usuario o animal
- Aceptar o rechazar solicitudes

## 📦 Tecnologías

- **NestJS**
- **TCP Transport**
- **SQLite / PostgreSQL / MySQL**

## 🛠️ Endpoints (internos)

> Este servicio es utilizado a través de la API Gateway.

- `createAdoptionRequest(data)`
- `getAdoptions()`
- `getAdoptionById(id)`
- `updateAdoptionStatus(id, status)`
- `deleteAdoption(id)`
