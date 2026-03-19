// Este archivo contiene instrucciones para desplegar en Cloudflare

# 🚀 Despliegue en Cloudflare Pages

## Pasos para desplegar:

### 1. Crear base de datos D1
```bash
# Crear la base de datos
wrangler d1 create divinity-sky-tools-db

# Copiar el database_id mostrado y actualizar wrangler.toml
```

### 2. Configurar variables de entorno
En el dashboard de Cloudflare Pages:
- Ve a Settings > Environment Variables
- Agrega:
  - `NEXTAUTH_URL` = `https://tu-dominio.pages.dev`
  - `NEXTAUTH_SECRET` = (genera con: `openssl rand -base64 32`)

### 3. Desplegar
```bash
# Construir para Cloudflare
npm run pages:build

# Desplegar
npm run pages:deploy
```

### 4. Inicializar la base de datos
Después del despliegue, ejecuta las migraciones D1:
```bash
wrangler d1 execute divinity-sky-tools-db --file=./prisma/migrations/init.sql
```

## Notas importantes:

1. **Autenticación**: NextAuth funciona con JWT en Cloudflare
2. **Base de datos**: D1 es SQLite compatible
3. **Archivos estáticos**: Next.js se exporta como sitio estático
4. **APIs**: Se ejecutan en el edge de Cloudflare

## Comandos útiles:

```bash
# Desarrollo local con Cloudflare
npm run pages:dev

# Ver logs
wrangler pages deployment tail

# Ver base de datos
wrangler d1 execute divinity-sky-tools-db --command "SELECT * FROM User"
```
