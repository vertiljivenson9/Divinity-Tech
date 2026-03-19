# DIVINITY SKY TOOLS

Tu catálogo digital de productos tecnológicos.

## 🚀 Características

- **Catálogo de Productos**: Navega y busca productos tecnológicos
- **Carrito de Compras**: Agrega productos y gestiona tu carrito
- **Panel de Administración**: Dashboard completo para administradores
- **Gestión de Productos**: CRUD completo de productos
- **Gestión de Categorías**: Organiza productos por categorías
- **Gestión de Pedidos**: Visualiza y administra pedidos
- **Autenticación**: Sistema de login con roles (admin/usuario)

## 🛠️ Tecnologías

- **Next.js 15** - Framework de React
- **TypeScript** - Tipado estático
- **Prisma** - ORM para base de datos
- **SQLite** - Base de datos (desarrollo)
- **Tailwind CSS 4** - Estilos
- **Zustand** - Estado del cliente
- **NextAuth.js** - Autenticación
- **shadcn/ui** - Componentes UI

## 🎨 Colores de Marca

- **Azul Primario**: #2563EB
- **Naranja/Mamey**: #FF6B35

## 📦 Instalación

```bash
# Clonar repositorio
git clone https://github.com/vertiljivenson9/Divinity-Tech.git
cd Divinity-Tech

# Instalar dependencias
npm install

# Configurar base de datos
npm run db:push
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev
```

## 🔐 Credenciales de Demo

**Administrador:**
- Email: admin@divinityskytools.com
- Contraseña: admin123

**Usuario:**
- Email: user@divinityskytools.com
- Contraseña: user123

## 🌐 Despliegue en Cloudflare Pages

1. Conecta tu repositorio de GitHub en Cloudflare Pages
2. Configura las variables de entorno:
   - `DATABASE_URL`: URL de la base de datos D1
   - `NEXTAUTH_URL`: URL de tu sitio (ej: https://divinity-sky-tools.pages.dev)
   - `NEXTAUTH_SECRET`: Secreto para JWT

3. Comando de build: `npm run pages:build`
4. Directorio de salida: `.vercel/output/static`

## 📁 Estructura del Proyecto

```
├── prisma/
│   ├── schema.prisma    # Esquema de base de datos
│   └── seed.ts          # Datos iniciales
├── src/
│   ├── app/
│   │   ├── api/         # Rutas API
│   │   ├── globals.css  # Estilos globales
│   │   ├── layout.tsx   # Layout principal
│   │   └── page.tsx     # Página principal
│   ├── components/
│   │   ├── ui/          # Componentes UI (shadcn)
│   │   └── ...          # Componentes personalizados
│   ├── lib/
│   │   ├── auth.ts      # Configuración NextAuth
│   │   ├── db.ts        # Cliente Prisma
│   │   └── utils.ts     # Utilidades
│   └── store/
│       └── cart.ts      # Estado del carrito (Zustand)
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── wrangler.toml        # Configuración Cloudflare
```

## 📄 Licencia

MIT License - © 2024 Divinity Sky Tools
