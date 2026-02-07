# GN News Portal Backend

Production-ready News Portal CMS backend built with Node.js, Express, and MySQL.

## Features

- **Authentication**: JWT-based admin authentication
- **News Management**: Create, read, update, delete news articles
- **Categories**: Manage article categories
- **Image Upload**: Cloudinary integration for image storage
- **Contact Form**: Save contact messages
- **Rate Limiting**: API rate limiting for security
- **Security**: Helmet, CORS, password hashing with bcrypt
- **Database**: MySQL with connection pooling
- **Validation**: Comprehensive input validation

## Tech Stack

- Node.js
- Express.js
- MySQL 2
- JWT Authentication
- Bcrypt
- Cloudinary
- Multer
- Dotenv
- Helmet
- CORS
- Rate Limiter

## Quick Start

### Prerequisites

- Node.js 14+
- MySQL Server
- Cloudinary Account

### Installation

1. **Clone the repository**
```bash
cd server
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Environment Variables**
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
- Database credentials
- JWT secret
- Cloudinary credentials
- Server port
- CORS origins

4. **Setup Database**
```bash
# Import the schema.sql file to your MySQL database
mysql -u root -p gn_news_portal < schema.sql
```

5. **Start the server**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Routes

### Authentication
- `POST /api/auth/login` - Admin login (accepts `email` OR `username`)
- `PUT /api/auth/change-password` - Change password (protected)

### News (Protected)
- `POST /api/news` - Create news
- `GET /api/news` - Get all news (admin)
- `PUT /api/news/:id` - Update news
- `PATCH /api/news/:id/status` - Update status
- `DELETE /api/news/:id` - Delete news

### News (Public)
- `GET /api/news/latest` - Get latest news
- `GET /api/news/breaking` - Get breaking news
- `GET /api/news/:slug` - Get news by slug
- `GET /api/news/category/:slug` - Get news by category

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (protected)
- `PUT /api/categories/:id` - Update category (protected)
- `DELETE /api/categories/:id` - Delete category (protected)

### Upload (Protected)
- `POST /api/upload` - Upload image to Cloudinary

### Contact (Public)
- `POST /api/contacts` - Submit contact message

## Default Admin

- Username: `admin`
- Password: `admin123`

⚠️ Change these credentials in production!

## Database Schema

### admins
- id, username, email, password, is_active, created_at, updated_at

### categories
- id, name, slug, description, is_active, created_at, updated_at

### news
- id, title, slug, summary, content, thumbnail, category_id, status, views, admin_id, created_at, updated_at

### contacts
- id, name, email, phone, message, is_read, created_at

## Production Deployment

### Environment Variables for Production
```
NODE_ENV=production
PORT=5000
DB_HOST=your_production_host
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
DB_NAME=gn_news_portal
JWT_SECRET=your_long_random_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
CORS_ORIGIN=https://yourdomain.com
```

### Starting in Production
```bash
npm install
npm run start
```

## Error Handling

All API responses follow a standard format:

**Success Response:**
```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation on all routes
- SQL injection prevention with prepared statements
- CORS protection
- Helmet.js for HTTP headers
- Environment variables for sensitive data

## Notes

- All timestamps are in UTC
- News slug is auto-generated from title
- Images are stored on Cloudinary (not locally)
- News views increment on each read
- Rate limits apply to all public endpoints

## Support

For issues or questions, contact the development team.

---

**Version:** 1.0.0  
**License:** MIT
