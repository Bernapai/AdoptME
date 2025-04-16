# 🐾 AdoptMe — SaaS para Refugios de Animales

**AdoptMe** es una plataforma SaaS diseñada para refugios de animales, donde pueden publicar a sus animales disponibles para adopción. Los usuarios interesados pueden explorar los perfiles de los animales, solicitar su adopción y agendar reuniones con los refugios para conocerlos.

## 📦 Arquitectura

Este proyecto está construido en **NestJS** bajo una arquitectura de **microservicios** gestionados a través de una **API Gateway**.

### 🛠️ Microservicios

| Servicio               | Descripción                                          |
|:----------------------|:-----------------------------------------------------|
| **api-gateway**         | Punto único de entrada. Valida tokens y enruta peticiones a los microservicios. |
| **auth-service**        | Maneja registro, login, y emisión de tokens JWT.     |
| **animal-service**      | Permite a los refugios gestionar animales disponibles para adopción. |
| **appointment-service** | Administra los turnos de reunión entre adoptantes y refugios. |
| **adoption-service**    | Gestiona las solicitudes de adopción de los usuarios. |

## 🧩 Tecnologías

- **NestJS** (microservicios + API Gateway)
- **JWT** (autenticación basada en tokens)
- **Docker** (opcional para despliegue)
- **RabbitMQ / Redis / TCP** (opcional para comunicación entre servicios)

## 🎯 Características

✅ Registro y autenticación de usuarios  
✅ Publicación de animales por parte de refugios  
✅ Solicitudes de adopción por usuarios  
✅ Gestión de turnos para conocer animales  
✅ Arquitectura escalable y modular basada en microservicios  