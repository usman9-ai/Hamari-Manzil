from django.db.models import F
from django.db.models.functions import Sin, Cos, ACos, Radians
from math import pi

def get_hostels_in_radius(latitude, longitude, radius_km, queryset):
    """
    Returns hostels within a given radius using the Haversine formula
    :param latitude: Float (-90 to 90)
    :param longitude: Float (-180 to 180)
    :param radius_km: Float (1 to 50 km)
    :param queryset: Initial queryset to filter
    :return: Filtered queryset
    :raises ValueError: If parameters are invalid
    :raises Exception: If calculation fails
    """
    # Validate parameters
    try:
        lat = float(latitude)
        lon = float(longitude)
        rad = float(radius_km)

        if not (-90 <= lat <= 90):
            raise ValueError(f"Latitude {lat} is out of range (-90 to 90)")
        if not (-180 <= lon <= 180):
            raise ValueError(f"Longitude {lon} is out of range (-180 to 180)")
        if not (1 <= rad <= 50):
            raise ValueError(f"Radius {rad} km is out of range (1 to 50)")

    except (TypeError, ValueError) as e:
        raise ValueError(f"Invalid coordinate or radius values: {str(e)}")

    try:
        # Earth's radius in kilometers
        R = 6371

        # Convert latitude and longitude to radians
        lat_rad = lat * pi / 180
        lon_rad = lon * pi / 180

        # Haversine formula
        queryset = queryset.annotate(
            distance=R * ACos(
                Cos(Radians(lat)) * Cos(Radians(F('latitude'))) *
                Cos(Radians(F('longitude')) - Radians(lon)) +
                Sin(Radians(lat)) * Sin(Radians(F('latitude')))
            )
        ).filter(distance__lte=radius_km)

        return queryset.order_by('distance')

    except Exception as e:
        raise Exception(f"Distance calculation failed: {str(e)}")