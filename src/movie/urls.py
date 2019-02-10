from rest_framework import routers
from .views import MovieView

# forming restframework url
router = routers.SimpleRouter()
router.register('m', MovieView)

# Setting for redirect request.
MovieView.as_view({'get': 'list', 'post':'create'}) # For: /api/subscriber
MovieView.as_view({'get': 'retrieve', 'put':'update'}) # For: /api/subscriber/1

urlpatterns = router.urls

