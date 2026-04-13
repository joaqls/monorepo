#!/usr/bin/env bash
set -e

ROOT="$(dirname "$0")/.."

echo "=== Backend tests ==="
cd "$ROOT/backend"
php artisan test

echo ""
echo "=== Frontend lint ==="
cd "$ROOT/frontend"
npm run lint -- --max-warnings=0

echo ""
echo "All checks passed."
