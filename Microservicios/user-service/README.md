# 👤 User Service

Este microservicio se encarga de la **gestión de usuarios** en AdoptMe, incluyendo el registro, autenticación y emisión de tokens JWT.

## 📌 Funcionalidades

- Registro de nuevos usuarios
- Inicio de sesión
- Emisión y validación de tokens JWT

## 📦 Tecnologías

- **NestJS**
- **JWT**
- **TCP Transport** (comunicación con la API Gateway)

## 🛠️ Endpoints (internos)

> Este servicio solo se comunica con la API Gateway.

- `registerUser(data)`
- `login(data)`
- `validateToken(token)`
