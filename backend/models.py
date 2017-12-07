from django.db import models
from django.contrib.auth.models import User


class VehicleBrand(models.Model):
    name = models.TextField(max_length=100)

    def __str__(self):
        return self.name

class VehicleYear(models.Model):
    name = models.TextField(max_length=4)

    def __str__(self):
        return self.name

class VehicleModel(models.Model):
    name = models.TextField(max_length=100)
    lat = models.DecimalField(max_digits=9, decimal_places=6,
                              null=True, blank=True)
    lon = models.DecimalField(max_digits=9, decimal_places=6,
                              null=True, blank=True)

    def __str__(self):
        return self.name


class Vehicle(models.Model):
    plate = models.TextField(max_length=10, db_index=True, unique=True)
    brand = models.ForeignKey('VehicleBrand', on_delete=models.PROTECT,blank=True)
    model = models.ForeignKey('VehicleModel', on_delete=models.PROTECT,blank=True)
    year = models.TextField(VehicleYear,blank=True)
    photo = models.ImageField(upload_to='vehicles',blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.plate


class Place(models.Model):
    name = models.TextField(max_length=100)
    lat = models.DecimalField(max_digits=9, decimal_places=6,
                              null=True, blank=True)
    lon = models.DecimalField(max_digits=9, decimal_places=6,
                              null=True, blank=True)

    def __str__(self):
        return self.name


class Tag(models.Model):
    name = models.TextField(max_length=100)

    def __str__(self):
        #return self.name
        return 'tag #'+str(self.id)


class Trip(models.Model):
    passengers = models.ManyToManyField(User, through='Passenger',
                                        through_fields=('trip', 'user'),
                                        related_name='trips')
    driver = models.ForeignKey('Driver', on_delete=models.PROTECT)
    vehicle = models.ForeignKey('Vehicle', on_delete=models.PROTECT)
    place_origin = models.ForeignKey('Place', on_delete=models.PROTECT,
                                     related_name='+', null=True, blank=True)
    place_destination = models.ForeignKey('Place', on_delete=models.PROTECT,
                                          related_name='+', null=True, blank=True)
    date_start = models.DateField()
    date_end = models.DateField(null=True, blank=True)
    time_start = models.TimeField(null=True, blank=True)
    time_end = models.TimeField(null=True, blank=True)
    CREATED = 0
    ON_TRIP = 1
    FINISHED = 2
    STATUSES = (
        (CREATED, 'Created'),
        (ON_TRIP, 'On trip'),
        (FINISHED, 'Finished'),
    )
    status = models.PositiveSmallIntegerField(choices=STATUSES, default=CREATED)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    created_user = models.ForeignKey(User, on_delete=models.PROTECT,
                                     related_name='+')
    modified_user = models.ForeignKey(User, on_delete=models.PROTECT,
                                      related_name='+')
    notified = models.BooleanField(default=False, blank=True)
    def __str__(self):
        return 'Trip #' + str(self.id)

class Sector(models.Model):
    name = models.TextField(max_length=100)

    def __str__(self):
        #return self.name
        return 'sector #'+str(self.id)

class Area(models.Model):
    name = models.TextField(max_length=100)
    def __str__(self):
        return 'Area #'+str(self.id)+' '+self.name
        

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.PROTECT, primary_key=True)
    codigo  = models.TextField(max_length=7, blank=True);
    area = models.ForeignKey('Area', null=True);
    lat_home = models.DecimalField(max_digits=9, decimal_places=6,
                                   null=True, blank=True)
    lon_home = models.DecimalField(max_digits=9, decimal_places=6,
                                   null=True, blank=True)
    address = models.TextField(max_length=200, blank=True)
    sector = models.ForeignKey('Sector',blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    phone = models.TextField(max_length=50, blank=True)
    modified_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.user.username


class Passenger(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    trip = models.ForeignKey('Trip', on_delete=models.PROTECT)

    trip_request = models.ForeignKey('TripRequest', on_delete=models.PROTECT)
    tags = models.ManyToManyField(Tag)
    lat_origin = models.DecimalField(max_digits=9, decimal_places=6,
                                     null=True, blank=True)
    lon_origin = models.DecimalField(max_digits=9, decimal_places=6,
                                     null=True, blank=True)
    lat_destination = models.DecimalField(max_digits=9, decimal_places=6,
                                          null=True, blank=True)
    lon_destination = models.DecimalField(max_digits=9, decimal_places=6,
                                          null=True, blank=True)
    date_pickup = models.DateField(null=True, blank=True)
    time_pickup = models.TimeField(null=True, blank=True)
    date_arrive = models.DateField(null=True, blank=True)
    time_arrive = models.TimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    created_user = models.ForeignKey(User, on_delete=models.PROTECT,
                                     related_name='+')
    modified_user = models.ForeignKey(User, on_delete=models.PROTECT,
                                      related_name='+')

    def __str__(self):
      return 'Pasajero #'+str(self.id)

class Driver(models.Model):
    user = models.OneToOneField(User, on_delete=models.PROTECT, primary_key=True)
    photo = models.ImageField(upload_to='vehicles', blank=True)
    vehicles = models.ManyToManyField('Vehicle', related_name='drivers')
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username

class Scheduler(models.Model):
    name = models.TextField(max_length=200, null=True);
    area = models.ForeignKey(Area, null=True)
    time_start = models.TimeField(null=True, blank=True)
    time_end = models.TimeField(null=True, blank=True)
    lift_start = models.BooleanField(default=True)
    lift_end = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Shift(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    tags = models.ManyToManyField('Tag')
    date_start = models.DateField()
    date_end = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    created_user = models.ForeignKey(User, on_delete=models.PROTECT,
                                     related_name='+')
    modified_user = models.ForeignKey(User, on_delete=models.PROTECT,
                                      related_name='+')
    scheduler = models.ForeignKey(Scheduler, blank=True, null=True)
    def __str__(self):
        return 'shift #'+str(self.id)


class TripRequest(models.Model):
    shift = models.ForeignKey('Shift', on_delete=models.PROTECT, null=True,
                              related_name='trip_requests')
    user = models.ForeignKey(User, on_delete=models.PROTECT,
                             related_name='trip_requests')
    tags = models.ManyToManyField(Tag)
    place_origin = models.ForeignKey('Place', on_delete=models.PROTECT,
                                     related_name='+', null=True, blank=True)
    place_destination = models.ForeignKey('Place', on_delete=models.PROTECT,
                                          related_name='+', null=True, blank=True)
    lat_origin = models.DecimalField(max_digits=9, decimal_places=6,
                                     null=True, blank=True)
    lon_origin = models.DecimalField(max_digits=9, decimal_places=6,
                                     null=True, blank=True)
    lat_destination = models.DecimalField(max_digits=9, decimal_places=6,
                                          null=True, blank=True)
    lon_destination = models.DecimalField(max_digits=9, decimal_places=6,
                                          null=True, blank=True)

    trip = models.ForeignKey('Trip', on_delete=models.PROTECT, null=True,
                                blank=True)
    date_pickup = models.DateField()
    time_pickup = models.TimeField(null=True, blank=True)
    date_arrive = models.DateField()
    time_arrive = models.TimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)
    created_user = models.ForeignKey(User, on_delete=models.PROTECT,
                                     related_name='+')
    modified_user = models.ForeignKey(User, on_delete=models.PROTECT,
                                      related_name='+')

    def __str__(self):
        #return self.name
        return 'Trip Request #'+str(self.id)