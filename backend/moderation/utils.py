from urllib.parse import quote

def generate_whatsapp_link(phone_number, message):
    """
    Generate WhatsApp click-to-chat link for manual OTP sending.
    As per roadmap: Simple wa.me link generation.
    
    Args:
        phone_number: Phone number (e.g., +923001234567 or 03001234567)
        message: Pre-filled message
        
    Returns:
        str: WhatsApp link
    """
    # Clean phone number
    cleaned_number = phone_number.replace('+', '').strip()
    
    # If starts with 0 (Pakistani format), convert to international
    if cleaned_number.startswith('0'):
        cleaned_number = '92' + cleaned_number[1:]
    
    # URL encode the message
    encoded_message = quote(message)
    
    return f"https://wa.me/{cleaned_number}?text={encoded_message}"