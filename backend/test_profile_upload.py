import requests

def test_profile_update():
    # Your test image path
    image_path = r"C:\Users\MuhammadUsman\Pictures\Screenshots\Screenshot 2025-10-04 150105.png"  # Put a test image in your backend folder
    
    # Your auth token (get this by logging in first)
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzYwMTk2MjEzLCJpYXQiOjE3NjAxOTI2MTMsImp0aSI6IjhlMmE3YTYyNjRiZTQ4ZWJhN2VjYmFjMzY4YzUwN2YwIiwidXNlcl9pZCI6IjciLCJlbWFpbCI6InVzbWFuOS5haUBnbWFpbC5jb20iLCJ1c2VybmFtZSI6InVzbWFuOV9haSIsInJvbGUiOiJvd25lciJ9.YWxh1S0ZOK5Wi2lSKgbO2FYWG6rQgTTiVEqgyeqMx5U"
    
    # API endpoint
    url = "http://localhost:8000/api/users/profile/"
    
    # Headers with authorization
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    # Prepare the files and data
    files = {
        'profile_picture': ('profile.jpg', open(image_path, 'rb'), 'image/jpeg')
    }
    
    data = {
        'first_name': 'Muhammad',
        'last_name': 'Usman',
        'phone': '03001234567',
        'city': 'Lahore'
    }
    
    # Make the request
    try:
        response = requests.patch(url, headers=headers, files=files, data=data)
        print("Status Code:", response.status_code)
        print("Response:", response.json())
    except Exception as e:
        print("Error:", str(e))
    finally:
        # Make sure to close the file
        files['profile_picture'][1].close()

if __name__ == "__main__":
    test_profile_update()