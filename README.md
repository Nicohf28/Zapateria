# Zapatería: Latido & Estilo
Aplicación web de tienda de zapatos desarrollada con **TypeScript**, **Express** y **Bootstrap**.  
Incluye un backend modular con gestión de sesiones, un carrito de compras persistente por usuario y una interfaz visual responsiva.

---

## Integrantes y Roles

| Nombre                         | Rol principal                    |
|--------------------------------|----------------------------------|
| Karen Sofía Rueda Piñeros      | Desarrolladora y Diseño UI/UX    |
| Nicolás Hernández Flórez       | Desarrollador y Organizador      |
| Sergio Andrés Cuesta Ortíz     | Desarrollador y Seguridad        |
| Gloria Jireth Mosquera Rondón  | Tester y Documentadora            |
| Juan David Maldonado Castro    | Tester y Documentador            |

---

## Dependencias

### Producción
- **express** ^4.19.2  
- **cookie-session** ^2.0.0  
- **cors** ^2.8.5  

### Desarrollo
- **typescript** ^5.6.3  
- **ts-node** ^10.9.2  
- **@types/express** ^4.17.21  
- **@types/cookie-session** ^2.0.45  
- **@types/cors** ^2.8.19  

---

## Requisitos
- Node.js 18+
- npm

## Instalación
```bash
npm install
```

## Desarrollo con ts-node
```bash
npm run dev
```
Visita: http://localhost:3000

## Producción (build + start)
```bash
npm run build
npm start
```

## Descripción General de las Rutas del Backend

### `/products.ts`
Maneja todo lo relacionado con el catálogo de productos.

- **GET `/products`**  
  Devuelve la lista completa de productos disponibles en el catálogo.  
  Los productos se almacenan en memoria como objetos con propiedades (`id`, `nombre`, `precio`, `imagen`, etc.).

---

### `/cart.ts`
Controla las operaciones del carrito de compras, que se guarda en la sesión del usuario.

- **GET `/cart`**  
  Retorna el contenido actual del carrito (productos y totales).

- **POST `/cart/add`**  
  Recibe un `id` de producto en el cuerpo de la solicitud y lo agrega al carrito del usuario.  
  Si el producto ya existe, incrementa la cantidad.

- **POST `/cart/remove`**  
  Elimina un producto del carrito, según su `id`.

Estas rutas utilizan `cookie-session` para mantener la persistencia entre solicitudes.

---

## Funcionamiento del Carrito e Integración Front–Back

El carrito funciona combinando lógica en el **frontend** y en el **backend**:

1. **Backend (`cart.ts`)**  
   - Almacena los productos seleccionados en la sesión del usuario (`req.session.cart`).  
   - Gestiona las operaciones de agregar, eliminar y listar productos mediante endpoints REST.

2. **Frontend (`app.js` y `cart.js`)**  
   - `app.js` maneja la carga y visualización de productos, generando dinámicamente los botones “Agregar al carrito”.  
   - Al hacer clic, se envía una petición `fetch('/cart/add', { method: 'POST' })` al backend.  
   - `cart.js` muestra el contenido del carrito, actualiza totales y permite eliminar productos en tiempo real.  
   - Todas las operaciones usan **fetch** para comunicarse con el servidor Express, logrando una integración fluida sin recargar la página.

---

## Estructura
```
zapateria-app/
├─ public/
│  ├─ index.html
│  ├─ cart.html
│  ├─ js/
│  │  ├─ app.js
│  │  └─ cart.js
│  └─ estilos/
│     └─ estilo.css
│  └─ img/
│  │  ├─ fondo.jpg
│  │  ├─ logo.png
│     └─ shoe_*.png
├─ src/
│  ├─ routes/
│  │  ├─ login.ts
│  │  ├─ register.ts
│  │  ├─ products.ts
│  │  └─ cart.ts
│  ├─ data/
│  │  ├─ data.json
│  │  └─ data.ts
│  ├─ types/
│  │  └─ index.d.ts
|  ├─ middleware/
│  │  └─ auth.ts
│  └─ server.ts
├─ package.json
├─ package.lock.json
├─ tsconfig.json
├─ INSTRUCCIONES.json
└─ README.md
```

## Notas
- El carrito se mantiene mediante sesiones usando cookie-session.
- El catálogo es en memoria (sin base de datos).
- Proyecto educativo con fines demostrativos de integración Frontend + Backend con TypeScript.
