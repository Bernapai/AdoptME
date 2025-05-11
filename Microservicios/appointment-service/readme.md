# 📅 Appointment Service

Este microservicio administra los **turnos de reunión** entre adoptantes y refugios en AdoptMe.

## 📌 Funcionalidades

- Crear, modificar y eliminar turnos
- Consultar turnos por usuario o refugio

## 📦 Tecnologías

- **NestJS**
- **TCP Transport**
- **SQLite / PostgreSQL / MySQL**

## 🛠️ Endpoints (internos)

> Este servicio solo responde a la API Gateway.

- `createAppointment(data)`
- `getAppointments()`
- `getAppointmentById(id)`
- `updateAppointment(id, data)`
- `deleteAppointment(id)`
