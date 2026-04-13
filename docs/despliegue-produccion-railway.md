# Despliegue de Producción (Railway)

## Decisión técnica

El despliegue final de la aplicación se realiza en Railway para frontend y backend.

Motivo principal:
- El backend Laravel (PHP 8.4 + migraciones + comandos Artisan en build/deploy) está ya integrado y probado en Railway con configuración nativa del proyecto.

Nota:
- Render puede ejecutar PHP usando Docker, pero en este proyecto ya existe una ruta estable con Railway y CI/CD funcional, por lo que se prioriza fiabilidad del entorno de producción.

## Arquitectura desplegada

- Frontend Angular: servicio Railway basado en Dockerfile dentro de `frontend/`.
- Backend Laravel: servicio Railway con `RAILPACK` y healthcheck en `/up`.
- Integración continua: GitHub Actions en `.github/workflows/ci-cd.yml`.

## Flujo CI/CD

Pipeline actual:
1. Job frontend:
- Instala dependencias (`npm ci`).
- Ejecuta tests unitarios (`ng test` en headless).
- Genera build de producción.

2. Job backend:
- Instala dependencias Composer.
- Genera `.env` de test y `APP_KEY`.
- Ejecuta migraciones con SQLite temporal.
- Ejecuta tests (`php artisan test`).

3. Job smoke (solo en `main`):
- Lanza comprobaciones HTTP contra frontend y backend desplegados en Railway.

## Secretos requeridos en GitHub

En el repositorio de GitHub:
- `RAILWAY_BACKEND_URL`
- `RAILWAY_FRONTEND_URL`

## Variables de entorno recomendadas (backend en Railway)

Mínimas:
- `APP_NAME`
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_KEY` (generada con `php artisan key:generate --show` localmente)
- `APP_URL` (URL pública del backend)
- `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`

Recomendadas para producción:
- `CACHE_STORE`
- `SESSION_DRIVER`
- `QUEUE_CONNECTION`
- `LOG_LEVEL=warning`

## Comandos de build/deploy

Backend Railway (definido en `backend/railway.json`):
- Build: `composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader && npm install --production && npm run build`
- Start: `php -S 0.0.0.0:${PORT:-8080} -t public`

Frontend Railway (definido en `frontend/railway.json`):
- Build por Dockerfile.
- Healthcheck: `/`

## Seguridad y verificación

Checklist final:
- HTTPS activo en frontend y backend.
- `APP_DEBUG=false` en producción.
- Variables sensibles fuera del repositorio.
- Frontend consumiendo API real (no localhost).
- Pruebas CI pasando antes de publicar en `main`.
- Endpoint `/up` del backend operativo.

## Evidencias sugeridas para la entrega

- Captura de los servicios en Railway (frontend/backend en estado healthy).
- Captura de ejecución correcta del workflow en GitHub Actions.
- URL pública del frontend funcionando.
- Prueba de consumo real de API desde el frontend (pantallas con datos reales).