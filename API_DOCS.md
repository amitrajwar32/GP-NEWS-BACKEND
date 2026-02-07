# API DOCUMENTATION

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. AUTHENTICATION ENDPOINTS

### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "admin": {
      "id": 1,
      "username": "admin",
      "email": "admin@gnewsportal.com"
    }
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid credentials",
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Rate Limit:** 5 requests per 15 minutes

---

### Change Password
```
PUT /auth/change-password
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "oldPassword": "admin123",
  "newPassword": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 2. NEWS ENDPOINTS

### Create News (Admin)
```
POST /news
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Breaking News Title",
  "summary": "Brief summary of the news",
  "content": "<h1>Full HTML content</h1><p>With all details</p>",
  "categoryId": 1,
  "thumbnail": "https://cloudinary.com/image.jpg"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "News created successfully",
  "data": {
    "id": 5,
    "title": "Breaking News Title",
    "slug": "breaking-news-title",
    "summary": "Brief summary of the news",
    "content": "<h1>Full HTML content</h1>...",
    "thumbnail": "https://cloudinary.com/image.jpg",
    "categoryId": 1
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Get All News (Admin)
```
GET /news?page=1&limit=10&status=published&categoryId=1&search=keyword
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)
- `status` (optional): draft, published, hidden
- `categoryId` (optional): Filter by category
- `search` (optional): Search in title and summary

**Success Response (200):**
```json
{
  "success": true,
  "message": "News retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "News Title",
      "slug": "news-title",
      "summary": "Summary",
      "content": "Content...",
      "thumbnail": "url",
      "category_id": 1,
      "category_name": "Technology",
      "status": "published",
      "views": 150,
      "admin_id": 1,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Get News by Slug (Public)
```
GET /news/:slug
```

**Example:** `GET /news/breaking-news-title`

**Success Response (200):**
```json
{
  "success": true,
  "message": "News retrieved successfully",
  "data": {
    "id": 1,
    "title": "Breaking News Title",
    "slug": "breaking-news-title",
    "summary": "Summary",
    "content": "Content...",
    "thumbnail": "url",
    "category_name": "Technology",
    "status": "published",
    "views": 151,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Note:** Views increment by 1 on each read

---

### Get Latest News (Public)
```
GET /news/latest?limit=5
```

**Query Parameters:**
- `limit` (optional, default: 5)

**Success Response (200):**
```json
{
  "success": true,
  "message": "Latest news retrieved successfully",
  "data": [
    {
      "id": 5,
      "title": "Latest News",
      "slug": "latest-news",
      "summary": "Summary",
      "thumbnail": "url",
      "category_name": "Business",
      "views": 200,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Get Breaking News (Public)
```
GET /news/breaking
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Breaking news retrieved successfully",
  "data": {
    "id": 3,
    "title": "Breaking News",
    "slug": "breaking-news",
    "summary": "Latest breaking news",
    "thumbnail": "url",
    "category_name": "Business",
    "views": 500,
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Get News by Category (Public)
```
GET /news/category/:slug?page=1&limit=10
```

**Example:** `GET /news/category/technology?page=1&limit=10`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Category news retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Tech News",
      "slug": "tech-news",
      "summary": "Summary",
      "thumbnail": "url",
      "category_name": "Technology",
      "views": 100,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "pages": 2
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Update News (Admin)
```
PUT /news/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "summary": "Updated summary",
  "content": "<h1>Updated content</h1>",
  "categoryId": 2,
  "thumbnail": "https://cloudinary.com/new-image.jpg"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "News updated successfully",
  "data": {
    "id": 1,
    "title": "Updated Title",
    "slug": "updated-title",
    "summary": "Updated summary",
    "categoryId": 2
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Update News Status (Admin)
```
PATCH /news/:id/status
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "published"
}
```

**Allowed Status Values:** `draft`, `published`, `hidden`

**Success Response (200):**
```json
{
  "success": true,
  "message": "News status updated successfully",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Delete News (Admin)
```
DELETE /news/:id
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "News deleted successfully",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Get Dashboard Stats (Admin)
```
GET /news/admin/stats
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Dashboard stats retrieved successfully",
  "data": {
    "totalNews": 25,
    "publishedNews": 20,
    "draftNews": 5,
    "totalViews": 5000
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 3. CATEGORY ENDPOINTS

### Get All Categories (Public)
```
GET /categories
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Technology",
      "slug": "technology",
      "description": "Latest technology news",
      "is_active": 1,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Get Category by ID (Public)
```
GET /categories/:id
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "id": 1,
    "name": "Technology",
    "slug": "technology",
    "description": "Latest technology news",
    "is_active": 1
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Create Category (Admin)
```
POST /categories
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Politics",
  "description": "Political news and updates"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": 6,
    "name": "Politics",
    "slug": "politics",
    "description": "Political news and updates"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Update Category (Admin)
```
PUT /categories/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Politics & News",
  "description": "Updated description"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Category updated successfully",
  "data": {
    "id": 6,
    "name": "Politics & News",
    "slug": "politics-news",
    "description": "Updated description"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Delete Category (Admin)
```
DELETE /categories/:id
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Category deleted successfully",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## 4. UPLOAD ENDPOINT

### Upload Image (Admin)
```
POST /upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `image` (file): Image file (JPEG, PNG, GIF, WebP)

**Constraints:**
- Max file size: 5MB
- Allowed formats: JPEG, PNG, GIF, WebP

**Success Response (201):**
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/.../image.jpg",
    "publicId": "gn_news_portal/1234567890_image",
    "width": 1920,
    "height": 1080
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid file type",
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Rate Limit:** 5 uploads per minute

---

## 5. CONTACT ENDPOINT

### Submit Contact Message (Public)
```
POST /contact
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I have a question about your news portal"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": {
    "id": 10
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid input or validation error |
| 401 | Unauthorized | Missing or invalid JWT token |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## Rate Limiting

- **General:** 100 requests per 15 minutes
- **Auth:** 5 login attempts per 15 minutes
- **Upload:** 5 uploads per minute

---

## Response Format

All API responses follow this standard:

**Success:**
```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": null,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Paginated:**
```json
{
  "success": true,
  "message": "Success message",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Create News
```bash
curl -X POST http://localhost:5000/api/news \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title":"Test News",
    "summary":"Test summary",
    "content":"Test content",
    "categoryId":1
  }'
```

### Get Latest News
```bash
curl http://localhost:5000/api/news/latest?limit=5
```

---

## Postman Collection

Import this as environment variable:
```
BASE_URL=http://localhost:5000/api
TOKEN={{token_from_login}}
```

---

Last Updated: 2024
