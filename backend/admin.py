from django.contrib import admin
from .models import Trip, Driver, Passenger, Vehicle, Place, TripRequest, Shift, VehicleBrand, VehicleModel, Tag, Profile

admin.site.register(Trip)
admin.site.register(Driver)
admin.site.register(Passenger)
admin.site.register(Vehicle)
admin.site.register(Place)
admin.site.register(TripRequest)
admin.site.register(Shift)
admin.site.register(VehicleBrand)
admin.site.register(VehicleModel)
admin.site.register(Tag)
admin.site.register(Profile)

# Register your models here.
#admin.site.register()