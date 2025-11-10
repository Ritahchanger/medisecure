# Secure Medical Platform
A full-stack secure medical platform built with modern technologies to handle sensitive medical data with encryption and proper access controls.

## 🏗️ Architecture
This platform consists of four main services:

- **Frontend**: React/Vue.js application with TypeScript
- **Backend**: Node.js Express API server
- **Python Encryption Service**: FastAPI service for handling data encryption/decryption
- **MongoDB**: Database for storing application data

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Make (optional, but recommended)

### Using Make Commands (Recommended)
```bash
# Build and start all services
make dev-all

# Run database seeding (create admin user)
make seed

# Start with hot-reloading (development)
make dev-hot-reload
```

### Using Docker Compose Directly
```bash
# Start all services
docker-compose up -d

# Start with rebuild
docker-compose up --build

# View logs
docker-compose logs -f
```

## 📁 Project Structure
```text
secure-medical-platform/
├── backend/                 # Node.js Express API
│   ├── src/
│   ├── uploads/            # File uploads directory
│   ├── package.json
│   └── Dockerfile
├── frontend/               # React/Vue.js frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── python-encryption/      # FastAPI encryption service
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml      # Main compose configuration
├── docker-compose.dev.yml  # Development configuration
├── Makefile               # Development commands
└── README.md
```

## 🛠️ Available Commands

### Development
```bash
make dev-all              # Build and run all services
make dev-hot-reload       # Start all services with hot-reloading
make dev-hot-backend      # Start backend with hot-reloading
make dev-hot-frontend     # Start frontend with hot-reloading
make dev-hot-python       # Start python service with hot-reloading
```

### Individual Services
```bash
make run-backend          # Start backend only
make run-frontend         # Start frontend only
make run-python           # Start python service only
make run-mongo           # Start MongoDB only
```

### Management
```bash
make stop-all            # Stop all services
make restart-all         # Restart all services
make logs-all           # Show all service logs
make logs-backend       # Show backend logs
make logs-frontend      # Show frontend logs
make logs-python        # Show python service logs
make logs-mongo         # Show MongoDB logs
```

### Database & Seeding
```bash
make seed               # Run database seeding (admin user)
make seed-admin         # Run admin seeding specifically
make db-shell          # Connect to MongoDB shell
make db-backup         # Backup MongoDB data
make db-status         # Check database connection status
```

### Maintenance
```bash
make build-all          # Build all Docker images
make clean-all          # Remove all containers, images, and volumes
make test-all           # Test if all services are running
make status             # Show container status
```

### Development (without Docker)
```bash
make dev-backend        # Run backend locally
make dev-frontend       # Run frontend locally
make dev-python         # Run python service locally
```

## 🌐 Service Endpoints
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5001
- **Python Encryption Service**: http://localhost:8001
- **MongoDB**: localhost:27017

## 🔐 Environment Configuration

### Backend Environment Variables
```env
MONGO_URL=mongodb://mongodb:27017/securedb
PYTHON_SERVICE_URL=http://python_encryption:5000
JWT_SECRET=your_jwt_secret_here
PORT=5001
```

### Frontend Environment Variables
```env
VITE_API_URL=http://localhost:5001/api

# ============================
# ADMIN LOGIN CREDENTIALS
# ============================
ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@medisecure.com
ADMIN_PASSWORD=Admin@12345
ADMIN_ROLE=admin

# ============================
# DOCTOR LOGIN CREDENTIALS
# ============================
DOCTOR_NAME=Dr. John Doe
DOCTOR_EMAIL=doctor@medisecure.com
DOCTOR_PASSWORD=Doctor@12345
DOCTOR_ROLE=doctor

# ============================
# NURSE LOGIN CREDENTIALS
# ============================
NURSE_NAME=Nurse Grace Wanjiru
NURSE_EMAIL=nurse@medisecure.com
NURSE_PASSWORD=Nurse@12345
NURSE_ROLE=nurse
```

## 🗄️ Database
The application uses MongoDB with:
- **Database**: securedb
- **Default port**: 27017

### Database Management
```bash
# Connect to MongoDB shell
make db-shell

# Create backup
make db-backup

# Check database health
make db-status
```

## 🔒 Security Features
- Data encryption at rest and in transit
- JWT-based authentication
- Role-based access control
- Secure file upload handling
- Input validation and sanitization

## 🚨 Troubleshooting

### Common Issues
- **Port conflicts**: Ensure ports 5001, 5174, 8001, and 27017 are available
- **Build failures**: Check Docker logs with `make logs-all`
- **Database connection**: Verify MongoDB is running with `make db-status`
- **Hot-reloading not working**: Ensure volume mounts are properly configured

### Debugging
```bash
# Check service status
make status

# View detailed logs
make logs-backend

# Test all services
make test-all

# Rebuild and restart
make clean-all && make dev-all
```

## 📝 API Documentation
Once running, API documentation is available at:
- **Backend API**: http://localhost:5001/api/docs
- **Python Service**: http://localhost:8001/docs

## 🔄 Development Workflow
1. Start services: `make dev-hot-reload`
2. Make code changes (auto-reload will apply changes)
3. Run database seeding: `make seed`
4. Access frontend: http://localhost:5174
5. Test APIs using the provided documentation

## 🏭 Production Deployment
For production deployment:
- Update environment variables for production
- Use production Dockerfile targets
- Set proper SSL certificates
- Configure reverse proxy (nginx)
- Set up monitoring and logging

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `make test-all`
5. Submit a pull request

## 📄 License
This project is licensed under the terms in the LICENSE file.

## 🆘 Support
For issues and questions:
- Check the troubleshooting section
- Review service logs with `make logs-all`
- Ensure all prerequisites are installed
- Verify port availability