# QUICK START GUIDE

## Step 1: Install Dependencies
```bash
cd "c:\Users\amitr\Videos\News Portal\GN News backend"
npm install
```

## Step 2: Create .env File
Copy `.env.example` to `.env` and update:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=gn_news_portal
DB_PORT=3306
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=24h
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

## Step 3: Setup MySQL Database
1. Open MySQL command line or client
2. Run the schema:
```sql
source schema.sql
```

Or create database and import:
```bash
mysql -u root -p < schema.sql
```

## Step 4: Start the Server
```bash
npm run dev
```

Server will start at: **http://localhost:5000**

## Step 5: Test the Backend

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

### Get Latest News
```bash
curl http://localhost:5000/api/news/latest
```

## API Base URL
```
http://localhost:5000/api
```

## Default Admin Credentials
- Username: **admin**
- Password: **admin123**

⚠️ Change in production!

## File Structure
```
server/
├── src/
│   ├── config/          # Database & Cloudinary config
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Database queries
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helpers & validators
│   ├── app.js          # Express app setup
│   └── server.js       # Server startup
├── package.json
├── .env.example
├── schema.sql
└── README.md
```

## Useful Commands

### Development
```bash
npm run dev    # Run with nodemon (auto-reload)
npm start      # Run production build
```

### Database
```bash
mysql -u root -p           # Connect to MySQL
mysql -u root -p < schema.sql  # Import schema
```

## Production Deployment

### Environment Variables
```
NODE_ENV=production
PORT=5000
DB_HOST=prod_db_host
DB_USER=prod_user
DB_PASSWORD=prod_secure_password
JWT_SECRET=long_random_secret_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
CORS_ORIGIN=https://yourdomain.com
```

### Deploy Steps
1. Copy files to server
2. Run `npm install`
3. Configure `.env` with production values
4. Run `npm start`
5. Use PM2 or similar for process management

## Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env or kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MySQL Connection Failed
- Check DB credentials in .env
- Ensure MySQL is running
- Verify database `gn_news_portal` exists

### JWT Errors
- Check JWT_SECRET in .env
- Ensure token is sent in Authorization header

### CORS Errors
- Update CORS_ORIGIN in .env
- Add your frontend URL to the list

## Security Checklist

✓ JWT authentication
✓ Password hashing (bcrypt)
✓ Rate limiting enabled
✓ Input validation
✓ SQL injection prevention (prepared statements)
✓ CORS configured
✓ Helmet.js for HTTP headers
✓ Environment variables for secrets

## Support
Check README.md for detailed documentation
