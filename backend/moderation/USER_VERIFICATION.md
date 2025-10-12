# User Verification - Simple Implementation

## Overview
Simple user verification using profile picture and CNIC images for admin review. WhatsApp verification has been removed for now and will be added in a later stage.

## How It Works

### 1. User Requests Verification
```
POST /api/moderation/verifications/request_user_verification/
{
  "profile_image": "cloudinary_url_or_upload",
  "cnic_image": "cloudinary_url_or_upload"
}
```

### 2. System Response
```json
{
  "id": 1,
  "status": "pending",
  "message": "Verification request submitted. Admin will review your profile and CNIC images.",
  "created_at": "2025-10-12T10:30:00Z"
}
```

### 3. User Flow
1. User uploads profile picture
2. User uploads CNIC (front side)
3. System creates verification request with status "pending"
4. Admin reviews the images
5. Admin approves or rejects with notes
6. User's `verification_status` is updated

### 4. Admin Review
```
POST /api/moderation/verifications/{id}/approve/
{
  "notes": "Verified successfully"
}

# OR

POST /api/moderation/verifications/{id}/reject/
{
  "notes": "CNIC image is not clear, please reupload"
}
```

## Code Structure

### `moderation/views.py`
```python
@action(detail=False, methods=['post'])
def request_user_verification(self, request):
    """User submits profile and CNIC for admin review"""
    verification = VerificationRequest.objects.create(
        user=request.user,
        request_type='user',
        profile_image=request.data.get('profile_image'),
        cnic_image=request.data.get('cnic_image')
    )
    return Response({'id': verification.id, 'status': 'pending'})
```

### `moderation/models.py`
```python
class VerificationRequest:
    # User Verification Fields
    profile_image = CloudinaryField('profile', null=True, blank=True)
    cnic_image = CloudinaryField('cnic', null=True, blank=True)
    
    def approve(self, admin_user, notes=''):
        """Approve verification and update user status"""
        self.status = 'approved'
        self.user.verification_status = True
        self.user.save()
    
    def reject(self, admin_user, notes):
        """Reject verification with reason"""
        self.status = 'rejected'
        self.admin_notes = notes
```

## Alignment with Tech Roadmap

✅ **From Roadmap (Section 1 - User Registration)**:
- "Owner creates account with:"
  - "Full Name"
  - "WhatsApp Number" ← Removed for now
  - "Password"
  - "Profile Picture (upload from device)" ✅
  - "CNIC Picture (front only)" ✅

✅ **From Roadmap (Section 1 - Admin Review)**:
- "Admin reviews:"
  - "Profile picture" ✅
  - "CNIC picture" ✅
  - "Verified WhatsApp number" ← Will be added later

- "Admin Actions:"
  - "Approve: Owner gets verified badge" ✅
  - "Reject: Clear explanation provided" ✅

## Benefits

1. **No External Dependencies**: Pure Django, no external services
2. **Zero Cost**: Completely free
3. **Simple**: Just image upload and admin review
4. **Fast MVP**: No complex verification flows
5. **Secure**: Manual admin review ensures quality

## Testing

### Manual Test
```bash
# 1. Request verification (with image uploads)
curl -X POST http://localhost:8000/api/moderation/verifications/request_user_verification/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "profile_image": "cloudinary_url_here",
    "cnic_image": "cloudinary_url_here"
  }'

# Response:
# {
#   "id": 1,
#   "status": "pending",
#   "message": "Verification request submitted..."
# }

# 2. Admin reviews and approves
curl -X POST http://localhost:8000/api/moderation/verifications/1/approve/ \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes": "All documents verified"}'

# Or rejects
curl -X POST http://localhost:8000/api/moderation/verifications/1/reject/ \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"notes": "CNIC image unclear, please reupload"}'
```

## Frontend Integration

```javascript
// 1. Upload images to Cloudinary (or your storage)
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'your_preset');
  
  const response = await fetch('https://api.cloudinary.com/v1_1/your_cloud/image/upload', {
    method: 'POST',
    body: formData
  });
  
  return (await response.json()).secure_url;
};

// 2. Request verification
const profileImageUrl = await uploadImage(profileFile);
const cnicImageUrl = await uploadImage(cnicFile);

const response = await fetch('/api/moderation/verifications/request_user_verification/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    profile_image: profileImageUrl,
    cnic_image: cnicImageUrl
  })
});

const data = await response.json();
// {id: 1, status: 'pending', message: '...'}

// 3. Show success message
<div className="alert alert-success">
  {data.message}
  <p>Your verification request is under review by our admin team.</p>
</div>
```

## Security

- Images stored securely in Cloudinary
- Manual admin review prevents fraud
- Verification status tracked in database
- Admin notes stored for audit trail

## Production Considerations

1. **Image Validation**: 
   - Validate image file types (JPEG, PNG only)
   - Check file size limits
   - Validate image dimensions

2. **Rate Limiting**: 
   - Limit verification requests per user
   - Prevent spam submissions

3. **Admin Dashboard**: 
   - Build UI for admin to review images side-by-side
   - Add image zoom/enhance features
   - Track review times

4. **Notifications**:
   - Notify users when verification is approved/rejected
   - Send email with admin notes if rejected

## Recent Changes

### WhatsApp Verification Removed (For Now)
- WhatsApp number verification removed from user verification flow
- Will be added back in later stage
- Currently focusing on profile + CNIC review only

### What Was Removed:
1. ✅ WhatsApp OTP generation
2. ✅ `verify_whatsapp` endpoint
3. ✅ WhatsApp number field requirement
4. ✅ Complex verification flow

### What Remains:
1. ✅ Simple profile + CNIC upload
2. ✅ Admin review and approval
3. ✅ Clean, simple API
4. ✅ Ready for MVP

## Summary

This implementation follows the simplified MVP approach:
- Profile picture upload
- CNIC image upload
- Admin manual review
- Approve/Reject with notes
- No unnecessary complexity

**Status**: ✅ Ready for MVP Development

## Future Enhancements

When ready to add WhatsApp verification back:
1. Add `whatsapp_number` field to verification request
2. Generate OTP and wa.me link
3. User sends OTP via WhatsApp manually
4. User enters OTP to verify number
5. Admin reviews profile + CNIC + verified WhatsApp

The infrastructure is already in the model, just needs to be activated.

---

**Current MVP Focus**: Week 1 - "Basic Authentication" and "User Profile Verification" with profile + CNIC only.

