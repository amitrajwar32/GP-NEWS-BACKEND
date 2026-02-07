# ENVIRONMENT SETUP GUIDE

## ⚙️ Development Environment Setup

### 1. Database Setup

#### Option A: Using MySQL Command Line
```bash
# Login to MySQL
mysql -u root -p

# Inside MySQL:
CREATE DATABASE gn_news_portal;
USE gn_news_portal;
source schema.sql;
```

#### Option B: Using MySQL GUI (Workbench/Navicat)
1. Create new database: `gn_news_portal`
2. Open and run `schema.sql` file
3. Verify tables created

#### Option C: Import SQL File Directly
```bash
mysql -u root -p gn_news_portal < schema.sql
```

---

## 2. Node.js Installation

### Windows
1. Download from https://nodejs.org/
2. Install Node.js LTS version
3. Verify installation:
```bash
node --version
npm --version
```

### macOS
```bash
brew install node
```

### Linux
```bash
sudo apt install nodejs npm
```

---

## 3. Environment Variables Setup

### Create .env File
```bash
# From the backend directory:
cp .env.example .env
```

### Edit .env File

**Development Values:**
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=gn_news_portal
DB_PORT=3306

# JWT Configuration
JWT_SECRET=dev_secret_key_change_in_production
JWT_EXPIRE=24h

# Cloudinary Configuration (Optional for initial testing)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration (for frontend)
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### Get Cloudinary Credentials
1. Sign up at https://cloudinary.com
2. Go to Dashboard
3. Copy: Cloud Name, API Key, API Secret
4. Paste in .env

---

## 4. Install Dependencies

```bash
# Navigate to backend directory
cd "c:\Users\amitr\Videos\News Portal\GN News backend"

# Install all packages
npm install
```

**Expected packages installed:**
- bcryptjs
- cloudinary
- cors
- dotenv
- express
- express-rate-limit
- helmet
- jsonwebtoken
- multer
- mysql2
- slugify
- nodemon

---

## 5. Start Development Server

```bash
npm run dev
```

**Expected output:**
```
✓ Server running on http://localhost:5000
✓ Environment: development
✓ API Base: http://localhost:5000/api
✓ MySQL Database Connected Successfully
```

---

## 6. Test API Endpoints

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Categories
```bash
curl http://localhost:5000/api/categories
```

---

## 7. Troubleshooting

### Error: Cannot find module 'mysql2'
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: Port 5000 already in use
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### Error: MySQL connection failed
1. Check MySQL is running
2. Verify credentials in .env
3. Ensure database `gn_news_portal` exists:
```bash
mysql -u root -p -e "SHOW DATABASES;"
```

### Error: JWT errors
- Check JWT_SECRET is set in .env
- Token should be in Authorization header:
```
Authorization: Bearer <token>
```

### Error: CORS issues
- Add frontend URL to CORS_ORIGIN in .env
- Example: `CORS_ORIGIN=http://localhost:3000`

---

## 8. Production Environment Setup

### Production .env
```env
# Database - Use Remote Host
DB_HOST=production.database.com
DB_USER=prod_user
DB_PASSWORD=strong_secure_password
DB_NAME=gn_news_portal
DB_PORT=3306

# JWT - Use Strong Secret
JWT_SECRET=very_long_random_string_min_32_chars_here
JWT_EXPIRE=24h

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_production_name
CLOUDINARY_API_KEY=your_production_key
CLOUDINARY_API_SECRET=your_production_secret

# Server
PORT=5000
NODE_ENV=production

# CORS - Production Domain
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

### Start Production Server
```bash
npm install --production
npm start
```

### Use Process Manager (PM2)
```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start src/server.js --name "news-portal"

# View logs
pm2 logs news-portal

# Restart on system reboot
pm2 startup
pm2 save
```

---

## 9. Docker Setup (Optional)

### Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY src ./src

ENV NODE_ENV=production
EXPOSE 5000

CMD ["npm", "start"]
```

### Build & Run
```bash
docker build -t gn-news-backend .
docker run -p 5000:5000 --env-file .env gn-news-backend
```

---

## 10. Database Backup

### Backup Database
```bash
mysqldump -u root -p gn_news_portal > backup.sql
```

### Restore Backup
```bash
mysql -u root -p gn_news_portal < backup.sql
```

---

## 11. Common NPM Commands

```bash
# Install packages
npm install

# Start development
npm run dev

# Start production
npm start

# List installed packages
npm list

# Update packages
npm update

# Check outdated packages
npm outdated
```

---

## 12. Git Setup (Optional)

### Initialize Git
```bash
git init
git add .
git commit -m "Initial commit - News Portal Backend"
```

### .gitignore (Already included)
- node_modules/
- .env
- .env.local
- *.log
- logs/

---

## 13. Code Editor Setup

### VS Code Extensions (Recommended)
1. REST Client - Test API endpoints
2. Database Client
3. ESLint
4. Prettier
5. Thunder Client

### Create .vscode/settings.json
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## 14. Postman Setup

### Import API Collection

1. Open Postman
2. Create new Collection: "GN News Portal"
3. Set Environment Variable:
```
BASE_URL: http://localhost:5000/api
TOKEN: (set after login)
```

4. Create Requests:
```
Login: POST {{BASE_URL}}/auth/login
Get Categories: GET {{BASE_URL}}/categories
Create News: POST {{BASE_URL}}/news
Get Latest News: GET {{BASE_URL}}/news/latest
```

---

## 15. Monitoring & Logging

### View Logs
```bash
npm run dev  # Shows real-time logs
```

### Log Files
- All logs printed to console
- Can be redirected to file:
```bash
npm run dev > logs.txt 2>&1
```

---

## Final Checklist

- [ ] Node.js installed
- [ ] MySQL running
- [ ] Database created with schema
- [ ] .env file configured
- [ ] npm packages installed
- [ ] Server starts without errors
- [ ] Can login with admin/admin123
- [ ] API endpoints responding
- [ ] Cloudinary configured (optional)

---

## Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Start development | `npm run dev` |
| Start production | `npm start` |
| Test API | `curl http://localhost:5000/api/health` |
| View database | `mysql -u root -p gn_news_portal` |

---

**Ready to develop!** 🚀
