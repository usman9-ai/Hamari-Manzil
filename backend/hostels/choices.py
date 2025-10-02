HOSTEL_FACILITIES = [
    {"key": "wifi", "label": "Wi-Fi"},
    {"key": "laundry", "label": "Laundry"},
    {"key": "mess", "label": "Mess / Dining"},
    {"key": "ac", "label": "Air Conditioning"},
    {"key": "heater", "label": "Room Heater"},
    {"key": "parking", "label": "Parking"},
    {"key": "security", "label": "24/7 Security"},
    {"key": "cctv", "label": "CCTV Cameras"},
    {"key": "generator", "label": "Backup Generator"},
    {"key": "study_area", "label": "Study Area"},
]

FACILITY_DICT = {f["key"]: f["label"] for f in HOSTEL_FACILITIES}
VALID_FACILITIES = {f["key"] for f in HOSTEL_FACILITIES}
