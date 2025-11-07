# Project Makefile for Secure Medical Platform

SHELL=/bin/bash

.PHONY: up down build rebuild logs ps stop clean prune backend exec-backend exec-python exec-frontend exec-mongo

# Build all images
build:
	docker compose build

# Start containers
up:
	docker compose up -d

# Stop containers
down:
	docker compose down

# Restart containers
restart:
	docker compose down && docker compose up -d

# View logs (all services)
logs:
	docker compose logs -f

# Check running containers
ps:
	docker compose ps

# Stop all containers
stop:
	docker compose stop

# Remove containers, images, and volumes (DANGER)
clean:
	docker compose down --rmi all --volumes --remove-orphans

# Variant clean (keep images)
prune:
	docker system prune -af && docker volume prune -f

# Rebuild without cache
rebuild:
	docker compose build --no-cache && docker compose up -d

# Exec into backend shell
exec-backend:
	docker exec -it node_backend /bin/bash

# Exec into python encryption shell
exec-python:
	docker exec -it python_encryption /bin/bash

# Exec into frontend shell
exec-frontend:
	docker exec -it react_frontend /bin/sh

# Exec into Mongo shell (requires mongo client installed)
exec-mongo:
	docker exec -it mongodb mongosh
