# 🖼️ Cloudinary Setup Guide

## Why Cloudinary?

Cloudinary is a cloud-based image management service that:
- Stores images securely in the cloud
- Provides automatic optimization
- Delivers images via CDN globally
- Eliminates server storage issues
- Offers free tier with 25GB storage

## 📋 Step 1: Create Cloudinary Account

1. Go to https://cloudinary.com/users/register/free
2. Sign up with email (or GitHub/Google)
3. Verify your email
4. You'll be redirected to the Cloudinary Dashboard

## 🔑 Step 2: Get Your Credentials

1. On the Cloudinary Dashboard, look for your **Dashboard** or **Settings**
2. You'll see three credentials:
   - **Cloud Name**: Your unique identifier
   - **API Key**: Public key for API access
   - **API Secret**: Secret key (keep it private!)

Example dashboard shows:
```
Cloud Name: demo
API Key: 123456789
API Secret: abc_xyz_123
```

## 💻 Step 3: Update .env File

Open `.env` file in the backend folder and update:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

Example:
```env
CLOUDINARY_CLOUD_NAME=mycompany
CLOUDINARY_API_KEY=987654321
CLOUDINARY_API_SECRET=xyz_abc_789
```

## 🚀 Step 4: Restart Server

```bash
npm run dev
```

## 📤 Step 5: Upload Image

### Using Postman:
1. Login to get JWT token from `/api/auth/login`
   - Email: `admin@gnewsportal.com`
   - Password: `admin123`

2. Go to `/api/upload` POST request
3. Set Authorization header with your token
4. In Body → form-data:
   - Key: `file` (type: File)
   - Value: Select your image file
5. Click Send

### Successful Response:
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/gn_news_portal/filename.jpg",
    "publicId": "gn_news_portal/filename",
    "width": 800,
    "height": 600
  }
}
```

## ✅ Verify Upload

1. Check the response URL - it should be a Cloudinary CDN link
2. Click the URL - it should display your image
3. Images are now stored in cloud (not on your server)

## 🛡️ Security Notes

- **API Secret**: Never share or commit to Git
- Use `.env` file (already in `.gitignore`)
- API Key is semi-public but still secure
- All uploads go to `gn_news_portal` folder on Cloudinary

## 📚 Cloudinary Dashboard

Visit your Cloudinary Dashboard to:
- View all uploaded images
- Check storage usage (free tier: 25GB)
- Manage transformations
- View analytics
- Adjust upload settings

## 🐛 Troubleshooting

### Error: "CLOUDINARY_CLOUD_NAME is undefined"
- ✅ Make sure .env file exists with correct credentials
- ✅ Restart the server after updating .env
- ✅ Check for typos in variable names

### Error: "Invalid credentials"
- ✅ Verify credentials from Cloudinary Dashboard
- ✅ Make sure you copied them correctly
- ✅ API Secret should NOT be in quotes

### Image not displaying
- ✅ Check the returned URL starts with `https://res.cloudinary.com/`
- ✅ Image permissions might be restricted
- ✅ Check Cloudinary Dashboard for upload

## 📞 Next Steps

1. ✅ Create Cloudinary account
2. ✅ Copy credentials to .env
3. ✅ Restart server
4. ✅ Test upload endpoint
5. ✅ Verify images display from CDN

---

**Status**: Ready to upload! 🚀

Once configured, all uploaded images will be:
- Stored on Cloudinary servers ☁️
- Served via global CDN 🌍
- Automatically optimized 🎯
- Backed up securely 🔒
