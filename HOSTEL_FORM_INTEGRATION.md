# Hostel Form - Backend-Frontend Integration

## Changes Made

### ✅ Updated Frontend Form to Match Backend Model

**Backend Hostel Model Fields:**
- `name` - CharField
- `city` - CharField (choices: karachi, lahore, islamabad, etc.)
- `latitude` - FloatField
- `longitude` - FloatField
- `map_location` - TextField (Google Maps URL)
- `gender` - CharField (choices: male, female, other)
- `total_rooms` - IntegerField
- `description` - TextField
- `media` - CloudinaryField (single image public_id)
- `owner` - Auto-set from logged-in user
- `verification_status` - Auto-set to False
- `created_at` - Auto-set timestamp

### ❌ Removed Fields (Not in Backend)
- `address` - Not in backend model
- `phone` - Not in backend model
- `email` - Not in backend model
- `availableRooms` - Not in backend model
- `facilities` - Not in hostel model (facilities are in Room model)
- `images` array - Backend only has single `media` field
- `videoUrl` - Not in backend model

### 📝 Field Mapping (Frontend → Backend)

| Frontend Field | Backend Field | Type | Notes |
|----------------|---------------|------|-------|
| `name` | `name` | string | Hostel name |
| `city` | `city` | string | Select from predefined cities |
| `gender` | `gender` | string | male/female/other |
| `total_rooms` | `total_rooms` | number | Total rooms count |
| `description` | `description` | string | Optional description |
| `latitude` | `latitude` | number | From map picker |
| `longitude` | `longitude` | number | From map picker |
| `map_location` | `map_location` | string | Google Maps URL |
| `media` | `media` | string | Cloudinary public_id |

## Created Files

### 1. `frontend/src/api/hostels.js`
API endpoint functions for hostel operations:
- `createHostel(data)` - POST /api/hostels/create-hostels/
- `getMyHostels()` - GET /api/hostels/my-hostels/
- `updateHostel(id, data)` - PATCH /api/hostels/edit-hostel/{id}/
- `deleteHostel(id)` - DELETE /api/hostels/delete-hostel/{id}/
- `getHostelFacilities()` - GET /api/hostels/hostel-facilities/

### 2. `frontend/src/services/hostelServices.js`
Service layer functions with error handling:
- `handleCreateHostel(hostelData)`
- `fetchMyHostels()`
- `handleUpdateHostel(id, hostelData)`
- `handleDeleteHostel(id)`
- `fetchHostelFacilities()`

### 3. Updated `frontend/src/pages/hostel/HostelForm.js`
Complete rewrite to match backend:
- Removed unnecessary fields
- Changed from multiple images to single media field
- Updated field names to match backend (snake_case)
- Added city dropdown with backend choices
- Updated location picker integration
- Single Cloudinary image upload (stores public_id)

## Backend API Endpoints

### Create Hostel
```http
POST /api/hostels/create-hostels/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Green Valley Hostel",
  "city": "karachi",
  "gender": "male",
  "total_rooms": 20,
  "latitude": 24.8607,
  "longitude": 67.0011,
  "map_location": "https://www.google.com/maps?q=24.8607,67.0011",
  "description": "A comfortable hostel near university",
  "media": "hostels/abc123def456"  // Cloudinary public_id
}
```

**Response (201):**
```json
{
  "id": 1,
  "owner": 5,
  "name": "Green Valley Hostel",
  "city": "karachi",
  "latitude": 24.8607,
  "longitude": 67.0011,
  "map_location": "https://www.google.com/maps?q=24.8607,67.0011",
  "gender": "male",
  "total_rooms": 20,
  "description": "A comfortable hostel near university",
  "created_at": "2024-01-15T10:30:00Z",
  "rooms": []
}
```

### Get My Hostels
```http
GET /api/hostels/my-hostels/
Authorization: Bearer {access_token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "owner": 5,
    "name": "Green Valley Hostel",
    "city": "karachi",
    ...
  }
]
```

### Update Hostel
```http
PATCH /api/hostels/edit-hostel/1/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Updated Name",
  "total_rooms": 25
}
```

### Delete Hostel
```http
DELETE /api/hostels/delete-hostel/1/
Authorization: Bearer {access_token}
```

## How to Use in Your App

### Example: Creating a Hostel

```javascript
import { handleCreateHostel } from '../services/hostelServices';

const handleSubmit = async (formData) => {
  try {
    const newHostel = await handleCreateHostel({
      name: formData.name,
      city: formData.city,
      gender: formData.gender,
      total_rooms: formData.total_rooms,
      latitude: formData.latitude,
      longitude: formData.longitude,
      map_location: formData.map_location,
      description: formData.description,
      media: formData.media  // Cloudinary public_id
    });
    
    console.log('Hostel created:', newHostel);
    // Redirect or show success message
  } catch (error) {
    console.error('Failed to create hostel:', error);
    // Handle error
  }
};
```

### Example: Fetching My Hostels

```javascript
import { fetchMyHostels } from '../services/hostelServices';

useEffect(() => {
  const loadHostels = async () => {
    try {
      const hostels = await fetchMyHostels();
      setHostels(hostels);
    } catch (error) {
      console.error('Failed to load hostels:', error);
    }
  };
  
  loadHostels();
}, []);
```

## Image Upload Process

1. **User clicks "Upload Hostel Image"**
2. **Cloudinary widget opens**
3. **User selects/uploads image**
4. **Widget returns result with:**
   - `public_id` - Store this in `formData.media`
   - `secure_url` - Use for preview only
5. **Form submits with `media` field containing public_id**
6. **Backend stores public_id in database**

## City Options

Available cities (from backend CITY_CHOICES):
- karachi - Karachi
- lahore - Lahore
- islamabad - Islamabad
- multan - Multan
- bahawalpur - Bahawalpur
- rawalpindi - Rawalpindi
- faisalabad - Faisalabad
- peshawar - Peshawar
- quetta - Quetta

## Gender Options

Available genders (from backend GENDER_CHOICES):
- male - Male
- female - Female
- other - Other

## Validation Rules

### Required Fields:
- name ✓
- city ✓
- gender ✓
- total_rooms ✓
- latitude ✓
- longitude ✓

### Optional Fields:
- description
- map_location
- media

### Field Constraints:
- `total_rooms` - Must be >= 0
- `latitude` - Valid latitude (-90 to 90)
- `longitude` - Valid longitude (-180 to 180)
- `city` - Must be one of the predefined choices
- `gender` - Must be one of: male, female, other

## Permissions

- Only users with `role="owner"` can create hostels
- Backend automatically sets `owner` field from logged-in user
- Owners can only view/edit/delete their own hostels

## Notes

1. **Facilities are NOT in Hostel model** - They belong to the Room model. Don't try to add facilities when creating a hostel.

2. **Available Rooms** - Not tracked at hostel level. This is calculated from individual rooms.

3. **Verification Status** - Auto-set to `False` on creation. Admin/moderator will verify later.

4. **Media Field** - Stores Cloudinary `public_id`, not full URL. Backend will generate URL when needed.

5. **Map Location** - Optional. Generated from latitude/longitude. Used for "View on Maps" links.

## Testing Checklist

- [ ] Create hostel with all required fields → Success
- [ ] Create hostel without name → Error
- [ ] Create hostel without latitude/longitude → Error
- [ ] Upload hostel image via Cloudinary → Image uploaded, public_id stored
- [ ] Select location from map → Coordinates populated
- [ ] Try to create hostel as student role → Permission denied
- [ ] View my hostels list → Shows only my hostels
- [ ] Update hostel details → Successfully updated
- [ ] Delete hostel → Successfully deleted

## Next Steps

After hostel is created, owner can:
1. Add rooms to the hostel
2. Set room details (capacity, rent, facilities)
3. Upload multiple images per room
4. Wait for admin verification

Facilities, room types, and pricing are all managed at the Room level, not Hostel level.

