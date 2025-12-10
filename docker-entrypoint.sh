#!/bin/sh
set -e

echo "Running migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx prisma db seed

echo "Starting Next.js server..."
exec node server.js
