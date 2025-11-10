# Makefile for Secure Medical Platform - Full Stack Application

.PHONY: help build build-all run run-all stop stop-all clean clean-all logs logs-all logs-backend logs-frontend logs-python logs-mongo test shell seed seed-admin db-shell dev dev-backend dev-frontend dev-python

# Variables
DOCKER_COMPOSE = docker-compose
BACKEND_CONTAINER = node_backend
FRONTEND_CONTAINER = react_frontend
PYTHON_CONTAINER = python_encryption
MONGO_CONTAINER = mongodb

# Ports
BACKEND_PORT = 5001
FRONTEND_PORT = 5173
PYTHON_PORT = 8001
MONGO_PORT = 27017

help:
	@echo "Secure Medical Platform - Available Commands:"
	@echo ""
	@echo "Development (Hot Reloading):"
	@echo "  make dev              - Start all services with hot-reloading"
	@echo "  make dev-backend      - Start backend with hot-reloading"
	@echo "  make dev-frontend     - Start frontend with hot-reloading"
	@echo "  make dev-python       - Start python service with hot-reloading"
	@echo ""
	@echo "Production:"
	@echo "  make run-all          - Start all services in production mode"
	@echo "  make run-backend      - Start backend only"
	@echo "  make run-frontend     - Start frontend only"
	@echo "  make run-python       - Start python service only"
	@echo "  make run-mongo        - Start MongoDB only"
	@echo ""
	@echo "Management:"
	@echo "  make stop-all         - Stop all services"
	@echo "  make restart-all      - Restart all services"
	@echo "  make logs-all         - Show logs from all services"
	@echo "  make logs-backend     - Show backend logs"
	@echo "  make logs-frontend    - Show frontend logs"
	@echo "  make logs-python      - Show python service logs"
	@echo "  make logs-mongo       - Show MongoDB logs"
	@echo ""
	@echo "Build:"
	@echo "  make build-all        - Build all Docker images"
	@echo "  make build-backend    - Build backend image"
	@echo "  make build-frontend   - Build frontend image"
	@echo "  make build-python     - Build python service image"
	@echo ""
	@echo "Database & Seeding:"
	@echo "  make seed             - Run database seeding (admin user)"
	@echo "  make seed-admin       - Run admin seeding specifically"
	@echo "  make db-shell         - Connect to MongoDB shell"
	@echo "  make db-backup        - Backup MongoDB data"
	@echo "  make db-status        - Check database connection status"
	@echo ""
	@echo "Testing & Maintenance:"
	@echo "  make test-all         - Test if all services are running"
	@echo "  make clean-all        - Remove all containers, images, and volumes"
	@echo "  make shell-backend    - Open shell in backend container"
	@echo "  make shell-frontend   - Open shell in frontend container"
	@echo "  make shell-python     - Open shell in python container"
	@echo "  make shell-mongo      - Open shell in MongoDB container"
	@echo "  make status           - Show container status"

# Development with Hot Reloading
dev:
	@echo "Starting ALL services with HOT-RELOADING..."
	@echo "Frontend: http://localhost:${FRONTEND_PORT}"
	@echo "Backend API: http://localhost:${BACKEND_PORT}"
	@echo "Python Service: http://localhost:${PYTHON_PORT}"
	@echo "MongoDB: localhost:${MONGO_PORT}"
	@echo ""
	@echo "Press Ctrl+C to stop all services"
	$(DOCKER_COMPOSE) up --build

dev-backend:
	@echo "Starting backend with HOT-RELOADING..."
	@echo "Backend API: http://localhost:${BACKEND_PORT}"
	$(DOCKER_COMPOSE) up --build backend

dev-frontend:
	@echo "Starting frontend with HOT-RELOADING..."
	@echo "Frontend: http://localhost:${FRONTEND_PORT}"
	$(DOCKER_COMPOSE) up --build frontend

dev-python:
	@echo "Starting python service with HOT-RELOADING..."
	@echo "Python Service: http://localhost:${PYTHON_PORT}"
	$(DOCKER_COMPOSE) up --build python_encryption

# Production Commands
run-all:
	@echo "Starting all services in PRODUCTION mode..."
	$(DOCKER_COMPOSE) up -d
	@echo "Services started:"
	@echo "  Frontend: http://localhost:${FRONTEND_PORT}"
	@echo "  Backend API: http://localhost:${BACKEND_PORT}"
	@echo "  Python Service: http://localhost:${PYTHON_PORT}"
	@echo "  MongoDB: localhost:${MONGO_PORT}"

run-backend:
	@echo "Starting backend service..."
	$(DOCKER_COMPOSE) up -d backend

run-frontend:
	@echo "Starting frontend service..."
	$(DOCKER_COMPOSE) up -d frontend

run-python:
	@echo "Starting python encryption service..."
	$(DOCKER_COMPOSE) up -d python_encryption

run-mongo:
	@echo "Starting MongoDB..."
	$(DOCKER_COMPOSE) up -d mongodb

# Stop Commands
stop-all:
	@echo "Stopping all services..."
	$(DOCKER_COMPOSE) down

stop-backend:
	@echo "Stopping backend service..."
	$(DOCKER_COMPOSE) stop backend

stop-frontend:
	@echo "Stopping frontend service..."
	$(DOCKER_COMPOSE) stop frontend

stop-python:
	@echo "Stopping python encryption service..."
	$(DOCKER_COMPOSE) stop python_encryption

stop-mongo:
	@echo "Stopping MongoDB..."
	$(DOCKER_COMPOSE) stop mongodb

# Restart Commands
restart-all: stop-all run-all
	@echo "All services restarted!"

restart-backend:
	@echo "Restarting backend service..."
	$(DOCKER_COMPOSE) restart backend

restart-frontend:
	@echo "Restarting frontend service..."
	$(DOCKER_COMPOSE) restart frontend

restart-python:
	@echo "Restarting python encryption service..."
	$(DOCKER_COMPOSE) restart python_encryption

restart-mongo:
	@echo "Restarting MongoDB..."
	$(DOCKER_COMPOSE) restart mongodb

# Build Commands
build-all:
	@echo "Building all Docker images..."
	$(DOCKER_COMPOSE) build

build-backend:
	@echo "Building backend image..."
	$(DOCKER_COMPOSE) build backend

build-frontend:
	@echo "Building frontend image..."
	$(DOCKER_COMPOSE) build frontend

build-python:
	@echo "Building python encryption service image..."
	$(DOCKER_COMPOSE) build python_encryption

# Database Seeding Commands
seed:
	@echo "Running database seeding..."
	@echo "Waiting for backend to be ready..."
	@sleep 10
	$(DOCKER_COMPOSE) exec backend npm run seed:admin || \
	($(DOCKER_COMPOSE) exec backend node ./src/seed/adminSeeder.js || \
	echo "Seeding completed or admin already exists")

seed-admin:
	@echo "Running admin user seeding..."
	$(DOCKER_COMPOSE) exec backend npm run seed:admin || \
	($(DOCKER_COMPOSE) exec backend node ./src/seed/adminSeeder.js || \
	echo "Admin seeding completed")

# Logs Commands
logs-all:
	$(DOCKER_COMPOSE) logs -f

logs-backend:
	$(DOCKER_COMPOSE) logs -f backend

logs-frontend:
	$(DOCKER_COMPOSE) logs -f frontend

logs-python:
	$(DOCKER_COMPOSE) logs -f python_encryption

logs-mongo:
	$(DOCKER_COMPOSE) logs -f mongodb

# Test Commands
test-all:
	@echo "Testing all services..."
	@echo "Testing MongoDB..."; docker exec $(MONGO_CONTAINER) mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1 && echo "✓ MongoDB OK" || echo "✗ MongoDB not ready"
	@echo "Testing backend..."; curl -f http://localhost:${BACKEND_PORT}/ >/dev/null 2>&1 && echo "✓ Backend OK" || echo "✗ Backend not ready"
	@echo "Testing frontend..."; curl -f http://localhost:${FRONTEND_PORT}/ >/dev/null 2>&1 && echo "✓ Frontend OK" || echo "✗ Frontend not ready"
	@echo "Testing python service..."; curl -f http://localhost:${PYTHON_PORT}/ >/dev/null 2>&1 && echo "✓ Python service OK" || echo "✗ Python service not ready"

# Shell Access
shell-backend:
	$(DOCKER_COMPOSE) exec backend /bin/sh

shell-frontend:
	$(DOCKER_COMPOSE) exec frontend /bin/sh

shell-python:
	$(DOCKER_COMPOSE) exec python_encryption /bin/bash

shell-mongo:
	$(DOCKER_COMPOSE) exec mongodb /bin/bash

# Database Commands
db-shell:
	$(DOCKER_COMPOSE) exec mongodb mongosh securedb

db-backup:
	@echo "Backing up MongoDB..."
	$(DOCKER_COMPOSE) exec mongodb sh -c 'mkdir -p /backup && mongodump --db securedb --out /backup/$$(date +%Y%m%d_%H%M%S)'
	@echo "Backup completed"

db-status:
	@echo "Checking database status..."
	$(DOCKER_COMPOSE) exec mongodb mongosh --eval "db.adminCommand('ping')" && echo "✓ Database is healthy" || echo "✗ Database connection failed"

# Cleanup
clean-all:
	@echo "Cleaning up all Docker resources..."
	$(DOCKER_COMPOSE) down -v --rmi all
	@echo "Cleanup complete!"

# Status Check
status:
	@echo "Container status:"
	$(DOCKER_COMPOSE) ps

# Default target
default: help