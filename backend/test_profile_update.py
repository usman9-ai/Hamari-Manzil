import requests
import os

def login_and_get_token():
    login_url = "http://localhost:8000/api/users/login/"
    login_data = {
        "email": "usman9.ai@gmail.com",  # Replace with your email
        "password": "usman123"  # Replace with your password
    }
    
    try:
        response = requests.post(login_url, json=login_data)
        response.raise_for_status()  # Raise exception for bad status codes
        return response.json()['access']
    except requests.exceptions.RequestException as e:
        print("Login Error:", str(e))
        print("Response:", response.text if 'response' in locals() else "No response")
        return None

def test_profile_update():
    # Get authentication token
    token = login_and_get_token()
    if not token:
        print("Failed to get authentication token")
        return

    # Your test image path (use an absolute path)
    image_path = os.path.join(os.path.dirname(__file__), "test_image.jpg")  # Put a test image in your backend folder
    
    # Create a test image if it doesn't exist
    if not os.path.exists(image_path):
        print(f"Creating test image at {image_path}")
        from PIL import Image
        img = Image.new('RGB', (100, 100), color='red')
        img.save(image_path)
    
    # API endpoint
    url = "http://localhost:8000/api/users/profile/"
    
    # Headers with authorization
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    try:
        # Open file and prepare the request
        with open(image_path, 'rb') as image_file:
            files = {
                'profile_picture': ('profile.jpg', image_file, 'image/jpeg')
            }
            
            data = {
                'first_name': 'Muhammad',
                'last_name': 'Usman',
                'phone': '03001234567',
                'city': 'Lahore'
            }
            
            # Print request details for debugging
            print("\nRequest URL:", url)
            print("Request Headers:", headers)
            print("Request Files:", files)
            print("Request Data:", data)
            
            # Print request details for debugging
            print("\nRequest URL:", url)
            print("Request Headers:", headers)
            print("Request Files:", files)
            print("Request Data:", data)
            
            # Make the request
            try:
                response = requests.patch(url, headers=headers, files=files, data=data)
                
                # Print detailed response
                print("\nStatus Code:", response.status_code)
                print("\nResponse Headers:", response.headers)
                print("\nResponse Body:", response.text)
                
                if response.status_code == 200:
                    print("\nProfile updated successfully!")
                else:
                    print("\nFailed to update profile")
                    print("\nDetailed error:", response.text)
            except Exception as e:
                print("\nException occurred:", str(e))
                
    except requests.exceptions.RequestException as e:
        print("Request Error:", str(e))
    except Exception as e:
        print("Error:", str(e))

if __name__ == "__main__":
    test_profile_update()