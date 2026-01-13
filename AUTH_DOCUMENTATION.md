# 🔐 Sistema de Autenticación - DishDash

## 📋 Resumen

El sistema ahora soporta dos tipos de usuarios con diferentes permisos:
- **Cliente (client)**: Puede ver recetas y crear/ver cotizaciones
- **Chef (chef)**: Acceso completo a todas las funcionalidades

## 🚀 Nuevos Endpoints

### 1. Registro de Cliente (Manual)
```
POST /dishdash/auth/register
Content-Type: application/json

{
  "email": "cliente@example.com",
  "password": "contraseña123",
  "name": "Nombre del Cliente"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123abc",
    "email": "cliente@example.com",
    "name": "Nombre del Cliente",
    "role": "client"
  }
}
```

### 2. Login (Chef o Cliente)
```
POST /dishdash/auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "contraseña123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123abc",
    "email": "usuario@example.com",
    "name": "Nombre Usuario",
    "role": "chef" // o "client"
  }
}
```

### 3. Login con Google (Solo crea Clientes)
```
GET /dishdash/auth/google
```
- Redirige a la página de login de Google
- Al completar, retorna un token JWT
- Siempre crea usuarios con role: "client"

## 🔑 Uso del Token

Todas las rutas protegidas requieren el token en el header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

El token incluye:
- id del usuario
- email
- name
- **role** (client o chef)

## 🛡️ Permisos por Rol

### Cliente (client)
✅ Puede acceder a:
- `GET /dishdash/recipes/*` - Ver todas las recetas
- `GET /dishdash/quotations/*` - Ver cotizaciones
- `POST /dishdash/quotations` - Crear cotizaciones
- `PUT /dishdash/quotations/:id` - Actualizar cotizaciones
- `DELETE /dishdash/quotations/:id` - Eliminar cotizaciones

❌ NO puede acceder a:
- Crear, editar o eliminar recetas
- Ingredientes
- Conversiones
- Análisis de costos
- Recetas escaladas
- Calendario
- Usuarios

### Chef (chef)
✅ Acceso completo a TODAS las rutas

## 👨‍🍳 Crear Usuarios Chef

Los chefs NO pueden auto-registrarse. Deben ser creados manualmente:

### Opción 1: Script (RECOMENDADO)
```bash
# 1. Editar el archivo scripts/createChef.js
# 2. Cambiar email, password y name
# 3. Ejecutar:
node scripts/createChef.js
```

### Opción 2: Directamente en MongoDB
Insertar documento con password hasheado:
```javascript
{
  "email": "chef@dishdash.com",
  "password": "$2a$10$hashedPasswordAqui...",
  "name": "Chef Principal",
  "role": "chef",
  "isActive": true,
  "lastLogin": new Date()
}
```

Para hashear password manualmente:
```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('tuPassword', 10, (e, h) => console.log(h));"
```

## 🔧 Configuración Requerida

Asegúrate de tener en tu archivo `.env`:

```env
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
MONGODB_URI=mongodb+srv://...
```

## 📱 Integración con Frontend

### 1. Registro de Cliente
```javascript
const response = await fetch('http://localhost:3007/dishdash/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'cliente@example.com',
    password: 'password123',
    name: 'Nombre Cliente'
  })
});
const data = await response.json();
// Guardar data.token en localStorage o contexto
```

### 2. Login
```javascript
const response = await fetch('http://localhost:3007/dishdash/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@example.com',
    password: 'password123'
  })
});
const data = await response.json();
// Guardar data.token y data.user.role
```

### 3. Usar Token en Peticiones
```javascript
const response = await fetch('http://localhost:3007/dishdash/recipes', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 4. Validar Role en Frontend
```javascript
// Después del login
if (data.user.role === 'chef') {
  // Mostrar todas las opciones del menú
} else {
  // Mostrar solo recetas y cotizaciones
}
```

## 🚨 Errores Comunes

### 401 - Access token required
```json
{ "message": "Access token required" }
```
**Solución**: Incluir header `Authorization: Bearer <token>`

### 403 - Access denied
```json
{
  "message": "Access denied. Insufficient permissions.",
  "required": ["chef"],
  "current": "client"
}
```
**Solución**: El usuario no tiene permisos para esta ruta

### 401 - Invalid email or password
```json
{ "message": "Invalid email or password" }
```
**Solución**: Credenciales incorrectas

### 400 - User already exists
```json
{ "message": "User with this email already exists" }
```
**Solución**: El email ya está registrado

## 📊 Resumen de Cambios

| Cambio | Descripción |
|--------|-------------|
| ✅ Modelo User | Agregados campos `password` y `role` |
| ✅ POST /auth/register | Registro manual para clientes |
| ✅ POST /auth/login | Login con email/password |
| ✅ Middleware authorizeRoles | Control de permisos por rol |
| ✅ Google OAuth | Forzado a crear solo clientes |
| ✅ JWT | Incluye role del usuario |
| ✅ Rutas protegidas | Aplicados permisos por rol |

## 🔄 Migración de Usuarios Existentes

Los usuarios existentes en la BD necesitan agregar el campo `role`:

```javascript
// Actualizar todos los usuarios existentes a 'client'
db.users.updateMany(
  { role: { $exists: false } },
  { $set: { role: 'client' } }
);
```

## ⚙️ Dependencias Agregadas

```bash
npm install bcryptjs
```
