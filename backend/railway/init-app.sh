#!/bin/bash
# v2 - force redeploy to pick up auth routes
set -e

if [[ -n "${DB_HOST}" && "${DB_HOST}" != "TU_HOST_REAL" ]]; then
	php artisan migrate --force
else
	echo "Skipping migrations: DB_HOST is not configured yet."
fi

php artisan optimize:clear
php artisan config:cache
php artisan event:cache
php artisan route:cache
php artisan view:cache