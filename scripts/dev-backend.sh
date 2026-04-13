#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/../backend"

if [ ! -f .env ]; then
  cp .env.example .env
  php artisan key:generate
fi

php artisan migrate --force
php artisan serve
