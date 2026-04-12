# mi-monorepo

Monorepo con backend Laravel y frontend Angular.

## Estructura

- `backend/`: API Laravel
- `frontend/`: app Angular
- `docs/`: documentación técnica
- `scripts/`: scripts de desarrollo y utilidades
- `.github/workflows/`: CI/CD

## Primer arranque

### Backend (Laravel)

1. `cd backend`
2. `cp .env.example .env`
3. `composer install`
4. `php artisan key:generate`
5. `php artisan migrate --seed`
6. `npm install && npm run dev`
7. `php artisan serve`

### Frontend (Angular)

1. `cd frontend`
2. `npm install`
3. `npm start`

## Convención recomendada

- Commits pequeños por carpeta (`backend`, `frontend` o raíz).
- Evitar dependencias compartidas en la raíz salvo necesidad real.
- Documentar cambios de arquitectura en `docs/`.
