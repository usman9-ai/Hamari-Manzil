from django.urls import path
from .views import (
    HostelSearchView,
    ReviewListCreateView,
    ReviewDetailView,
    FavoriteListCreateView,
    InteractionLogCreateView
)

urlpatterns = [
    # Search
    path('hostelsearch/', HostelSearchView.as_view(), name='hostel-search'),
    

    # Reviews
    path('reviews/create', ReviewListCreateView.as_view(), name='create-review'),
    path('reviews/view/', ReviewDetailView.as_view(), name='view-reviews'),

    # Favorites
    path('favorites/<int:hostel_id>/toggle/', FavoriteListCreateView.as_view(), name='toggle-favorite'),

    # Interactions
    path('interactions/<int:hostel_id>/', InteractionLogCreateView.as_view(), name='log-interaction'),
]
