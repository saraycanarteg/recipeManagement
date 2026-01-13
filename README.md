# 🍽️ DishDash - Recipe Management System

Backend API para sistema de gestión de recetas y catering profesional.

## 🚀 Características

- 🔐 **Sistema de Autenticación Dual**
  - Login con email/password
  - OAuth con Google
  - Control de acceso basado en roles (Chef/Cliente)

- 👨‍🍳 **Gestión de Recetas**
  - CRUD completo
  - Categorización
  - Escalado automático
  - Cálculo de costos

- 💰 **Análisis Financiero**
  - Costo por ingrediente
  - Costo por porción
  - Precio sugerido de venta
  - Cálculo de impuestos (IVA, servicio)

- 📋 **Sistema de Cotizaciones**
  - Solicitudes de clientes
  - Cotizaciones de chef
  - Seguimiento de estados
  - Eventos y calendarios

## 📦 Instalación

```bash
# Clonar repositorio
git clone <url-repositorio>

# Instalar dependencias
npm install

# Instalar bcryptjs (si no se instaló automáticamente)
npm install bcryptjs

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Iniciar servidor
npm start
```

## 🔧 Variables de Entorno

Crear archivo `.env` con:

```env
MONGODB_URI=tu_mongodb_uri
JWT_SECRET=tu_secreto_jwt_seguro
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
NODE_ENV=development
PORT=3007
```

## 👥 Crear Usuario Chef

Los chefs deben crearse manualmente:

```bash
# Editar scripts/createChef.js con los datos del chef
node scripts/createChef.js
```

## 📚 Documentación

- [AUTH_DOCUMENTATION.md](./AUTH_DOCUMENTATION.md) - Guía completa de autenticación y permisos
- [Endpoints API](./AUTH_DOCUMENTATION.md#-nuevos-endpoints) - Lista de todos los endpoints

## 🛡️ Permisos

### Cliente
- ✅ Ver recetas (GET)
- ✅ Gestionar cotizaciones (CRUD)

### Chef
- ✅ Acceso completo a todas las funcionalidades

## 🔗 Endpoints Principales

### Autenticación
- `POST /dishdash/auth/register` - Registro de cliente
- `POST /dishdash/auth/login` - Login
- `GET /dishdash/auth/google` - Login con Google

### Recetas
- `GET /dishdash/recipes` - Listar recetas
- `POST /dishdash/recipe` - Crear receta (Chef)
- `PUT /dishdash/recipe/:id` - Actualizar receta (Chef)
- `DELETE /dishdash/recipe/:id` - Eliminar receta (Chef)

### Cotizaciones
- `GET /dishdash/quotations` - Listar cotizaciones
- `POST /dishdash/quotations` - Crear cotización
- `PUT /dishdash/quotations/:id` - Actualizar cotización

## 🏗️ Stack Tecnológico

- **Node.js** + **Express 5.x**
- **MongoDB** + **Mongoose**
- **Passport.js** (Google OAuth)
- **JWT** (autenticación)
- **bcryptjs** (encriptación)

## 👨‍💻 Autor

**Nova Developers**

## 📄 Licencia

ISC
