#!/bin/bash
# v3 - robust predeploy: always refresh cache and keep deploy alive if migration fails
set -e

# Always clear stale caches first so new config (e.g. CORS) is picked up.
php artisan optimize:clear

if [[ -n "${DB_HOST}" && "${DB_HOST}" != "TU_HOST_REAL" ]]; then
	if ! php artisan migrate --force; then
		echo "Warning: migrations failed, continuing deployment to avoid serving stale config cache."
	fi
else
	echo "Skipping migrations: DB_HOST is not configured yet."
fi

php artisan config:cache
php artisan event:cache
php artisan route:cache
php artisan view:cache