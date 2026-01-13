# 🧪 Ejemplos de Peticiones API

## 🔐 AUTENTICACIÓN

### 1. Registrar Cliente
```http
POST http://localhost:3007/dishdash/auth/register
Content-Type: application/json

{
  "email": "cliente1@example.com",
  "password": "password123",
  "name": "Juan Cliente"
}
```

**Respuesta esperada (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123def...",
    "email": "cliente1@example.com",
    "name": "Juan Cliente",
    "role": "client"
  }
}
```

---

### 2. Login (Chef o Cliente)
```http
POST http://localhost:3007/dishdash/auth/login
Content-Type: application/json

{
  "email": "chef@dishdash.com",
  "password": "Chef123!"
}
```

**Respuesta esperada (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65abc123def...",
    "email": "chef@dishdash.com",
    "name": "Chef Principal",
    "role": "chef"
  }
}
```

---

### 3. Verificar Token
```http
GET http://localhost:3007/dishdash/auth/verify
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🍳 RECETAS

### 4. Listar Recetas (Ambos roles)
```http
GET http://localhost:3007/dishdash/recipes
Authorization: Bearer <tu_token>
```

---

### 5. Crear Receta (Solo Chef)
```http
POST http://localhost:3007/dishdash/recipe
Authorization: Bearer <token_de_chef>
Content-Type: application/json

{
  "name": "Pasta Carbonara",
  "servings": 4,
  "description": "Pasta italiana clásica",
  "ingredients": [
    {
      "ingredientName": "Pasta",
      "productId": "PASTA001",
      "quantity": 500,
      "unit": "g"
    },
    {
      "ingredientName": "Huevos",
      "productId": "EGG001",
      "quantity": 4,
      "unit": "unit"
    }
  ],
  "instructions": [
    "Cocinar la pasta al dente",
    "Batir los huevos",
    "Mezclar todo"
  ],
  "costPerServing": 2.50,
  "pricePerServing": 8.00,
  "category": "Pasta"
}
```

---

### 6. Actualizar Receta (Solo Chef)
```http
PUT http://localhost:3007/dishdash/recipe/65abc123def...
Authorization: Bearer <token_de_chef>
Content-Type: application/json

{
  "name": "Pasta Carbonara Premium",
  "servings": 4,
  "description": "Versión mejorada",
  ...
}
```

---

### 7. Eliminar Receta (Solo Chef)
```http
DELETE http://localhost:3007/dishdash/recipe/65abc123def...
Authorization: Bearer <token_de_chef>
```

---

## 💼 COTIZACIONES

### 8. Crear Solicitud de Cliente (Ambos roles)
```http
POST http://localhost:3007/dishdash/quotations
Authorization: Bearer <tu_token>
Content-Type: application/json

{
  "quotationType": "client_request",
  "clientInfo": {
    "name": "María García",
    "phone": "+1234567890",
    "email": "maria@example.com"
  },
  "eventInfo": {
    "eventType": "wedding",
    "numberOfGuests": 150,
    "eventDate": "2026-06-15",
    "eventTime": "18:00",
    "location": {
      "address": "Calle Principal 123, Ciudad",
      "venueName": "Salón de Eventos Elegante"
    },
    "specialRequirements": "Menú vegetariano disponible",
    "dietaryRestrictions": "Sin gluten para 10 personas",
    "preferredCuisine": "Italiana",
    "additionalNotes": "Preferencia por platos tradicionales"
  },
  "budgetRange": {
    "min": 5000,
    "max": 8000
  }
}
```

---

### 9. Listar Cotizaciones (Ambos roles)
```http
GET http://localhost:3007/dishdash/quotations
Authorization: Bearer <tu_token>
```

**Filtrar por tipo:**
```http
GET http://localhost:3007/dishdash/quotations?quotationType=client_request
Authorization: Bearer <tu_token>
```

**Filtrar por estado:**
```http
GET http://localhost:3007/dishdash/quotations?status=pending
Authorization: Bearer <tu_token>
```

---

### 10. Ver Cotización Específica (Ambos roles)
```http
GET http://localhost:3007/dishdash/quotations/65abc123def...
Authorization: Bearer <tu_token>
```

---

### 11. Actualizar Estado de Cotización (Ambos roles)
```http
PATCH http://localhost:3007/dishdash/quotations/65abc123def.../status
Authorization: Bearer <tu_token>
Content-Type: application/json

{
  "status": "approved"
}
```

Estados disponibles: `pending`, `approved`, `completed`, `cancelled`

---

## 🧪 INGREDIENTES (Solo Chef)

### 12. Listar Ingredientes
```http
GET http://localhost:3007/dishdash/ingredients
Authorization: Bearer <token_de_chef>
```

---

### 13. Crear Ingrediente
```http
POST http://localhost:3007/dishdash/ingredient
Authorization: Bearer <token_de_chef>
Content-Type: application/json

{
  "productId": "PASTA001",
  "name": "Pasta Spaghetti",
  "category": "Pasta",
  "product": "Spaghetti No. 5",
  "brand": "Barilla",
  "size": 500,
  "sizeUnit": "g",
  "price": 2.50,
  "availableUnits": 50,
  "supplier": "Distribuidora Italia",
  "density": 0.6
}
```

---

## 💰 ANÁLISIS DE COSTOS (Solo Chef)

### 14. Calcular Costo de Receta
```http
POST http://localhost:3007/dishdash/costanalysis/calculate
Authorization: Bearer <token_de_chef>
Content-Type: application/json

{
  "recipeId": "65abc123def...",
  "indirectCostPercent": 15,
  "ivaPercent": 16,
  "servicePercent": 10
}
```

---

### 15. Crear Análisis de Costo
```http
POST http://localhost:3007/dishdash/costanalysis
Authorization: Bearer <token_de_chef>
Content-Type: application/json

{
  "recipeId": "65abc123def...",
  "recipeName": "Pasta Carbonara",
  "servings": 4,
  "ingredients": [...],
  "ingredientsCost": 10.00,
  "indirectCost": 1.50,
  "totalCost": 11.50,
  "costPerServing": 2.88,
  "suggestedPricePerServing": 8.00,
  "taxes": {
    "ivaPercent": 16,
    "servicePercent": 10,
    "ivaAmount": 1.28,
    "serviceAmount": 0.80,
    "totalTaxes": 2.08
  }
}
```

---

## 🚨 ERRORES COMUNES

### Error 401: Sin token
```json
{
  "message": "Access token required"
}
```
**Solución:** Agregar header `Authorization: Bearer <token>`

---

### Error 403: Permisos insuficientes
```json
{
  "message": "Access denied. Insufficient permissions.",
  "required": ["chef"],
  "current": "client"
}
```
**Solución:** Esta ruta solo está disponible para chefs

---

### Error 400: Usuario ya existe
```json
{
  "message": "User with this email already exists"
}
```
**Solución:** Usar un email diferente o hacer login

---

### Error 401: Credenciales inválidas
```json
{
  "message": "Invalid email or password"
}
```
**Solución:** Verificar email y contraseña

---

## 📝 NOTAS

1. **Guardar el token**: Después de login o registro, guarda el token para usarlo en las siguientes peticiones
2. **Header Authorization**: Todas las rutas protegidas requieren `Authorization: Bearer <token>`
3. **Roles**: El token incluye el rol del usuario, el backend valida automáticamente los permisos
4. **Google OAuth**: Visita `http://localhost:3007/dishdash/auth/google` en el navegador para login con Google

---

## 🔗 URL Base

**Desarrollo:** `http://localhost:3007/dishdash`
**Producción:** `https://recipemanagement-caj9.onrender.com/dishdash`
