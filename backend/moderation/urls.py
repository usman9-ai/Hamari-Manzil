# users/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
# from .views import UserViewSet  # make sure you have this in views.py

router = DefaultRouter()
# router.register(r'', UserViewSet)  # all user endpoints

urlpatterns = [
    path('', include(router.urls)),
]
