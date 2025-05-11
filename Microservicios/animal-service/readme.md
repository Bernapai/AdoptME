# 🐶 Animal Service

Este microservicio permite a los refugios gestionar la **lista de animales disponibles** para adopción en AdoptMe.

## 📌 Funcionalidades

- Crear, leer, actualizar y eliminar animales
- Asociar animales con refugios

## 📦 Tecnologías

- **NestJS**
- **TCP Transport**
- **SQLite / PostgreSQL / MySQL** (dependiendo de tu elección)

## 🛠️ Endpoints (internos)

> Este servicio es consumido a través de la API Gateway.

- `createAnimal(data)`
- `getAnimals()`
- `getAnimalById(id)`
- `updateAnimal(id, data)`
- `deleteAnimal(id)`
