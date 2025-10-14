# Cloudinary Setup Guide

## ✅ Good News!

**Cloudinary is already fully integrated** in your Django project! You just need to add your credentials.

## 📋 What's Already Done

1. ✅ Cloudinary packages installed (`cloudinary`, `cloudinary_storage`)
2. ✅ Settings configured to use environment variables
3. ✅ All models use `CloudinaryField` for images
4. ✅ Image upload functionality already in serializers

## 🚀 Quick Setup (3 Steps)

### Step 1: Get Cloudinary Credentials

1. Go to https://cloudinary.com/
2. Sign up for a **FREE account** (or login)
3. Go to your **Dashboard**: https://cloudinary.com/console
4. Copy these values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Step 2: Create `.env` File

Create a file named `.env` in the `backend/` directory:

```env
# Django Settings
SECRET_KEY=django-insecure-_f1kml_ka0vbyulx6083^e^-4cv_ipmc9n92c(-ze&(_@_#(uv
DEBUG=True

# Cloudinary Configuration
# Paste your values from Cloudinary dashboard
CLOUDINARY_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Replace** `your_cloud_name_here`, etc. with your actual Cloudinary credentials.

### Step 3: Test It!

```bash
cd backend
python manage.py shell
```

```python
import cloudinary
import cloudinary.uploader

# Test upload
result = cloudinary.uploader.upload("test_image.jpg")
print(result['secure_url'])
# Should print: https://res.cloudinary.com/your_cloud/image/upload/...
```

## 📸 How Images Are Stored

### Models Already Configured:

```python
# User Profile
profile_picture = CloudinaryField('image')

# Verification Request
profile_image = CloudinaryField('profile')
cnic_image = CloudinaryField('cnic')

# Hostel & Room
media = CloudinaryField('image')
```

### When You Upload:

1. **Frontend** uploads file to Cloudinary directly OR
2. **Backend** receives file, uploads to Cloudinary, stores URL

## 🔧 Current Configuration

Located in `backend/backend/settings.py`:

```python
# Cloudinary configuration
cloudinary.config(
    cloud_name=config('CLOUDINARY_NAME'),
    api_key=config('CLOUDINARY_API_KEY'),
    api_secret=config('CLOUDINARY_API_SECRET'),
    secure=True
)

# Default file storage
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'
```

## 📱 Frontend Integration Options

### Option 1: Direct Upload from Frontend (Recommended)

**Pros**: Faster, no backend load
**Setup**: Use Cloudinary's upload widget

```javascript
// Upload directly to Cloudinary
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_upload_preset'); // Create in Cloudinary
  
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  );
  
  const data = await response.json();
  return data.secure_url; // Use this URL in your API
};

// Then send URL to Django
const profileUrl = await uploadImage(profileFile);
fetch('/api/moderation/verifications/request_user_verification/', {
  method: 'POST',
  body: JSON.stringify({
    profile_image: profileUrl,
    cnic_image: await uploadImage(cnicFile)
  })
});
```

**To create upload preset:**
1. Go to Cloudinary Dashboard
2. Settings → Upload
3. Add upload preset (e.g., `hostel_finder_unsigned`)
4. Set to "Unsigned" for frontend upload

### Option 2: Upload via Django Backend

**Pros**: More control, validation
**Already implemented** in your serializers!

```javascript
// Frontend sends file to Django
const formData = new FormData();
formData.append('profile_picture', profileFile);

fetch('/api/users/profile/', {
  method: 'PUT',
  body: formData
});

// Django handles Cloudinary upload automatically
```

## 🎯 For Your Verification System

Since you're using Cloudinary URLs, use **Option 1** (direct upload):

```javascript
// 1. User selects images
const profileFile = document.getElementById('profile').files[0];
const cnicFile = document.getElementById('cnic').files[0];

// 2. Upload to Cloudinary
const profileUrl = await uploadToCloudinary(profileFile);
const cnicUrl = await uploadToCloudinary(cnicFile);

// 3. Send URLs to Django
const response = await fetch('/api/moderation/verifications/request_user_verification/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    profile_image: profileUrl,
    cnic_image: cnicUrl
  })
});
```

## 🔒 Security Tips

### For Frontend Upload:

1. **Create unsigned upload preset** in Cloudinary dashboard
2. **Add folder** to organize uploads: `folder: 'verification/'`
3. **Set limits**: Max file size, allowed formats
4. **Add transformation**: Auto-optimize images

```javascript
formData.append('folder', 'verification/profile');
formData.append('transformation', 'c_limit,w_500,h_500,q_auto');
```

### For Backend Upload:

Already secured via environment variables - just keep `.env` secret!

## 📊 Cloudinary Free Tier

✅ **25 GB storage**  
✅ **25 GB bandwidth/month**  
✅ **Unlimited transformations**  
✅ **Perfect for MVP!**

## 🧪 Test Endpoints

After setup, test these work:

```bash
# Test user profile update with image
POST /api/users/profile/
multipart/form-data
profile_picture: [file]

# Test verification with Cloudinary URLs
POST /api/moderation/verifications/request_user_verification/
{
  "profile_image": "https://res.cloudinary.com/...",
  "cnic_image": "https://res.cloudinary.com/..."
}
```

## ❓ Troubleshooting

### "Could not load config from environment"
- Check `.env` file exists in `backend/` directory
- Check variable names match exactly: `CLOUDINARY_NAME`, not `CLOUDINARY_CLOUD_NAME`
- Restart Django server after creating `.env`

### "Invalid credentials"
- Double-check API Key and Secret from Cloudinary dashboard
- Make sure no extra spaces in `.env` file
- Try regenerating credentials in Cloudinary

### Images not uploading
- Check Cloudinary dashboard quota (free tier: 25GB)
- Verify file format is supported (JPEG, PNG, GIF, etc.)
- Check file size limits

## ✅ Summary

**You have:**
- ✅ Cloudinary fully integrated
- ✅ All models configured
- ✅ Upload functionality ready
- ✅ Just need to add credentials

**Next step:**
1. Create `.env` file in `backend/` folder
2. Add your Cloudinary credentials
3. Test it works
4. Start using it in your verification system!

---

**Note**: The `.env` file is already in `.gitignore`, so your credentials won't be committed to git. Keep it secure!


