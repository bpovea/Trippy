from django.conf.urls import include, url
from . import views
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework import routers
from django.views.decorators.csrf import csrf_exempt


from .viewsets import *

router = routers.DefaultRouter()
router.register(r'trips', TripViewSetJR, base_name='trip')
router.register(r'vehicles', VehicleViewSetJR, base_name='vehicle')

router = routers.SimpleRouter()
urlpatterns = router.urls

urlpatterns = [
	
	url(r'^tripRequests/$', csrf_exempt(views.tripRequestList)),
	url(r'^trips/$', csrf_exempt(views.tripList)),
	url(r'^drivers/$', csrf_exempt(views.driversList)),
	url(r'^vehicles/$', csrf_exempt(views.vehiclesList)),
	url(r'^profiles/$', csrf_exempt(views.profilesList)),
	url(r'^passengers/$', csrf_exempt(views.passengerList)),
	url(r'^passengers/(?P<pk>[0-9]+)$', csrf_exempt(views.passengerDetail)),
	url(r'^trips/(?P<pk>[0-9]+)$', csrf_exempt(views.tripsDetail)),
	url(r'^tripsIds/$', csrf_exempt(views.tripIdsList)),
	url(r'^api/trips', TripViewSetJR.as_view({'get': 'list'})),
	url(r'^api/vehicles', VehicleViewSetJR.as_view({'get': 'list'}))

]

