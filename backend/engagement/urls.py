from django.urls import path
from .views import (
    HostelSearchView,
    ReviewListCreateView,
    ReviewDetailView,
    FavoriteListCreateView,
    FavoriteDeleteView,
    HostelFavoritesView,
    InteractionLogCreateView
)

urlpatterns = [
    # Search
    path('search/', HostelSearchView.as_view(), name='hostel-search'),
    
    # Reviews
    path('reviews/', ReviewListCreateView.as_view(), name='review-list-create'),
    path('reviews/<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
    path('hostels/<int:hostel_id>/reviews/', ReviewListCreateView.as_view(), name='hostel-reviews'),

    # Favorites
    path('favorites/', FavoriteListCreateView.as_view(), name='favorite-list-create'),
    path('favorites/<int:pk>/', FavoriteDeleteView.as_view(), name='favorite-delete'),
    path('hostels/<int:hostel_id>/favorite/', HostelFavoritesView.as_view(), name='check-favorite'),

    # Contact & Interactions
    path('interactions/', InteractionLogCreateView.as_view(), name='create-interaction'),
]