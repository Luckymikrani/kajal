# Secure Deployment Guide for Beauty E-commerce Platform

## 🔒 Security Best Practices

### 1. Environment Variables Setup

**Never commit sensitive data to your repository!**

```bash
# Create .env file (never commit this)
cp .env.example .env

# Fill in your actual values in .env
nano .env
```

### 2. Database Security

#### Option A: PostgreSQL (Recommended)
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE beauty_store;
CREATE USER store_admin WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE beauty_store TO store_admin;
\q
```

#### Option B: MongoDB
```bash
# Install MongoDB
sudo apt install mongodb

# Create admin user
mongo
use beauty_store
db.createUser({
  user: "store_admin",
  pwd: "your_secure_password",
  roles: ["readWrite", "dbAdmin"]
})
```

### 3. Server Security Configuration

#### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name yourstore.com;

    # SSL Configuration
    ssl_certificate /path/to/ssl/cert.pem;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /api/auth {
        limit_req zone=login burst=3 nodelay;
        proxy_pass http://localhost:3000;
    }

    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://localhost:3000;
    }
}
```

### 4. Deployment Options

#### Option A: Traditional VPS (DigitalOcean, Linode, AWS EC2)

```bash
# 1. Clone repository (without sensitive files)
git clone https://github.com/yourusername/beauty-store.git
cd beauty-store

# 2. Install dependencies
npm install --production

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your secure values

# 4. Build the application
npm run build

# 5. Use PM2 for process management
npm install -g pm2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

#### Option B: Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: beauty_store
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - app
    restart: unless-stopped

volumes:
  postgres_data:
```

#### Option C: Cloud Platforms (Vercel, Netlify, Railway)

**Vercel Deployment:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Never use .env files in cloud deployments
```

### 5. Admin Account Security

#### Secure Admin Creation Script
```javascript
// scripts/create-admin.js
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

async function createSecureAdmin() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME;

  if (!email || !password || !name) {
    throw new Error('Admin credentials not provided in environment variables');
  }

  // Hash password with high salt rounds
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create admin user
  await pool.query(
    'INSERT INTO users (email, password, name, role, created_at) VALUES ($1, $2, $3, $4, NOW()) ON CONFLICT (email) DO UPDATE SET password = $2',
    [email, hashedPassword, name, 'admin']
  );

  console.log('Admin user created successfully');
  await pool.end();
}

createSecureAdmin().catch(console.error);
```

### 6. Security Monitoring

#### Log Security Events
```javascript
// utils/security-logger.js
const winston = require('winston');

const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/security.log' }),
    new winston.transports.Console()
  ],
});

export function logSecurityEvent(event, details) {
  securityLogger.warn('SECURITY_EVENT', {
    event,
    details,
    timestamp: new Date().toISOString(),
    ip: details.ip,
    userAgent: details.userAgent,
  });
}
```

### 7. SSL/TLS Certificate

#### Using Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourstore.com -d www.yourstore.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 8. Backup Strategy

```bash
#!/bin/bash
# backup.sh

# Database backup
pg_dump $DATABASE_URL > "backup_$(date +%Y%m%d_%H%M%S).sql"

# Upload to secure storage (AWS S3)
aws s3 cp backup_*.sql s3://your-backup-bucket/database/

# Keep only last 30 days of backups
find . -name "backup_*.sql" -mtime +30 -delete
```

### 9. Monitoring & Alerts

#### Health Check Endpoint
```javascript
// routes/health.js
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});
```

### 10. Security Checklist

- [ ] Environment variables configured (no hardcoded secrets)
- [ ] Database secured with strong passwords
- [ ] SSL/TLS certificate installed
- [ ] Rate limiting implemented
- [ ] Security headers configured
- [ ] Input validation and sanitization
- [ ] Password hashing with bcrypt
- [ ] Session security configured
- [ ] CORS properly configured
- [ ] File upload restrictions
- [ ] Error handling (no sensitive info in errors)
- [ ] Logging and monitoring setup
- [ ] Regular security updates
- [ ] Backup strategy implemented
- [ ] Admin account secured with strong password
- [ ] Two-factor authentication (recommended)

## 🚀 Quick Deployment Commands

```bash
# 1. Prepare server
sudo apt update && sudo apt upgrade -y
sudo apt install nginx postgresql nodejs npm

# 2. Clone and setup
git clone your-repo
cd beauty-store
npm install
cp .env.example .env
# Edit .env with secure values

# 3. Database setup
sudo -u postgres createdb beauty_store
npm run migrate

# 4. Build and start
npm run build
npm install -g pm2
pm2 start ecosystem.config.js

# 5. Configure nginx
sudo cp nginx.conf /etc/nginx/sites-available/beauty-store
sudo ln -s /etc/nginx/sites-available/beauty-store /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 6. SSL certificate
sudo certbot --nginx -d yourstore.com
```

## 🔐 Post-Deployment Security

1. **Change all default passwords**
2. **Enable firewall** (`sudo ufw enable`)
3. **Disable root SSH access**
4. **Set up monitoring** (Uptime Robot, New Relic)
5. **Regular security updates**
6. **Monitor logs** for suspicious activity
7. **Implement 2FA** for admin accounts
8. **Regular penetration testing**

Remember: Security is an ongoing process, not a one-time setup!