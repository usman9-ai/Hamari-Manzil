from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VerificationViewSet

router = DefaultRouter()
router.register(r'verifications', VerificationViewSet, basename='verification')

urlpatterns = [
    path('', include(router.urls)),
]
