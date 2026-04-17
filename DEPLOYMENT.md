# Deployment Guide

This document covers deploying the Binance Trading Bot to production environments.

## Table of Contents

1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Cloud Deployment](#cloud-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Monitoring & Logging](#monitoring--logging)
6. [Backup & Recovery](#backup--recovery)

## Local Development

### Using npm directly

```bash
# Install all dependencies
cd backend && npm install
cd ../frontend && npm install
cd ../cli && npm install

# Build everything
cd backend && npm run build
cd ../frontend && npm run build
cd ../cli && npm run build

# Run development servers
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev

# Terminal 3 (optional)
cd cli && npm start -- start BTCUSDT
```

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Backend API: http://localhost:3000
- Frontend: http://localhost:5173
- PostgreSQL: localhost:5432

## Docker Deployment

### Build Images

```bash
# Backend production image
docker build -f backend/Dockerfile -t binance-bot-backend:latest ./backend

# Frontend production image
docker build -f frontend/Dockerfile -t binance-bot-frontend:latest ./frontend

# Tag for registry
docker tag binance-bot-backend:latest myregistry/binance-bot-backend:latest
docker tag binance-bot-frontend:latest myregistry/binance-bot-frontend:latest
```

### Push to Registry

```bash
# Push to Docker Hub or your registry
docker push myregistry/binance-bot-backend:latest
docker push myregistry/binance-bot-frontend:latest
```

### Run Containers

```bash
# Backend
docker run -d \
  --name binance-backend \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  binance-bot-backend:latest

# Frontend
docker run -d \
  --name binance-frontend \
  -p 5173:5173 \
  -e VITE_API_URL=http://api.example.com \
  binance-bot-frontend:latest
```

### Docker Compose Production

```yaml
version: '3.8'

services:
  backend:
    image: myregistry/binance-bot-backend:latest
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      BINANCE_API_KEY: ${BINANCE_API_KEY}
      BINANCE_API_SECRET: ${BINANCE_API_SECRET}
    restart: always
    networks:
      - binance-app

  frontend:
    image: myregistry/binance-bot-frontend:latest
    ports:
      - "5173:5173"
    environment:
      VITE_API_URL: http://api.example.com
    restart: always
    depends_on:
      - backend
    networks:
      - binance-app

  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: binance_bot
    volumes:
      - postgres-data:/var/lib/postgresql/data
    restart: always
    networks:
      - binance-app

volumes:
  postgres-data:

networks:
  binance-app:
```

## Cloud Deployment

### AWS Deployment

#### Using Elastic Container Service (ECS)

1. Create ECR repositories:
```bash
aws ecr create-repository --repository-name binance-bot-backend
aws ecr create-repository --repository-name binance-bot-frontend
```

2. Push images:
```bash
aws ecr get-login-password | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
docker tag binance-bot-backend:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/binance-bot-backend:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/binance-bot-backend:latest
```

3. Create ECS task definitions and services

### Heroku Deployment

```bash
# Login to Heroku
heroku login

# Create apps
heroku create binance-bot-backend
heroku create binance-bot-frontend

# Add PostgreSQL add-on
heroku addons:create heroku-postgresql:hobby-dev -a binance-bot-backend

# Set environment variables
heroku config:set BINANCE_API_KEY=your_key -a binance-bot-backend
heroku config:set BINANCE_API_SECRET=your_secret -a binance-bot-backend

# Deploy
git push heroku main
```

### DigitalOcean App Platform

1. Connect GitHub repository
2. Create app specification:
```yaml
name: binance-bot
services:
  - name: backend
    github:
      repo: your-username/binance-app
      branch: main
    build_command: cd backend && npm run build
    run_command: cd backend && npm start
    http_port: 3000
  
  - name: frontend
    github:
      repo: your-username/binance-app
      branch: main
    build_command: cd frontend && npm run build
    run_command: cd frontend && npm run preview
    http_port: 5173

databases:
  - name: postgres
    engine: PG
    version: "15"
```

## Environment Configuration

### Backend (.env)

```env
# Server
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Binance API
BINANCE_API_KEY=your_key_here
BINANCE_API_SECRET=your_secret_here

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=binance_bot
DB_USER=postgres
DB_PASSWORD=secure_password

# Monitoring
MONITOR_SYMBOL=BTCUSDT
MONITOR_INTERVAL=1m
CHECK_INTERVAL_SECONDS=10

# Security
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=https://yourdomain.com
```

### Frontend (.env)

```env
VITE_API_URL=https://api.yourdomain.com
VITE_WS_URL=wss://api.yourdomain.com
```

### Environment Variable Management

Use environment variable managers:
- HashiCorp Vault for secrets
- AWS Secrets Manager
- GitHub Secrets for CI/CD
- Docker secrets for swarm

## Monitoring & Logging

### Application Logging

Add logging to production (update backend/src/index.ts):

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Monitoring Solutions

- **Prometheus** + Grafana for metrics
- **ELK Stack** for centralized logging
- **DataDog** for APM
- **New Relic** for performance monitoring

### Health Checks

Backend includes `/health` endpoint:
```bash
curl http://localhost:3000/health
```

Configure health checks in Docker:
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
```

## Backup & Recovery

### Database Backup

```bash
# Backup PostgreSQL
pg_dump -U postgres -d binance_bot -F c -b -v -f binance_bot.backup

# Restore backup
pg_restore -U postgres -d binance_bot -v binance_bot.backup
```

### Automated Backups

```bash
# Cron job for daily backups
0 2 * * * pg_dump -U postgres -d binance_bot > /backups/binance_bot_$(date +\%Y\%m\%d).sql
```

### Database Recovery

```bash
# Restore from backup
psql -U postgres -d binance_bot < binance_bot.sql
```

## CI/CD Pipeline

The project includes GitHub Actions workflow (`.github/workflows/ci-cd.yml`) that:

1. Runs tests on push/PR
2. Builds Docker images
3. Pushes to registry
4. Deploys to production

### Deployment Workflow

```
Push to main
↓
Run tests
↓
Build images
↓
Push to registry
↓
Deploy to production
```

## Performance Optimization

### Backend

- Enable gzip compression
- Implement caching strategies
- Use connection pooling for database
- Optimize database queries

### Frontend

- Enable production build optimization
- Implement code splitting
- Use CDN for static assets
- Enable service workers

### Database

- Add indexes on frequently queried columns
- Archive old trading history
- Implement connection pooling

## Security Checklist

- [ ] All environment variables configured
- [ ] HTTPS/TLS enabled
- [ ] CORS properly configured
- [ ] API rate limiting enabled
- [ ] Database backups automated
- [ ] Logs monitored
- [ ] Security headers configured
- [ ] Dependencies updated
- [ ] API keys rotated regularly
- [ ] Firewall rules configured

## Troubleshooting

### Backend not starting

```bash
# Check logs
docker logs binance-backend

# Verify environment variables
docker inspect binance-backend

# Test connection
curl http://localhost:3000/health
```

### Frontend connection issues

```bash
# Check browser console for errors
# Verify API_URL in .env
# Check CORS configuration
# Verify WebSocket connectivity
```

### Database connection failed

```bash
# Test database connection
psql -U postgres -h localhost -d binance_bot

# Check database credentials
# Verify network connectivity
# Check firewall rules
```

## Support

For deployment issues:
1. Check logs with `docker logs <container_name>`
2. Verify environment variables
3. Test connectivity between services
4. Consult monitoring dashboards
5. Review error logs

---

**For more information, see:**
- [Main README](README.md)
- [Architecture Documentation](docs/STACK.md)
- [Project Structure](PROJECT_STRUCTURE.md)
