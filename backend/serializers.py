from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from itertools import chain

#Shift, VehicleBrand, VehicleModel, Tag, Profile



class TripRequestIdsSerializerBP(serializers.ModelSerializer):
	class Meta:
		model = TripRequest
		fields = '__all__'

class UserSerializerBP(serializers.ModelSerializer):
	class Meta:
		model = User
		exclude = ('password',)

class ProfileSerializerBP(serializers.ModelSerializer):
	user = UserSerializerBP(read_only=True)
	class Meta:
		model = Profile
		fields= '__all__'

class PlaceSerializerBP(serializers.ModelSerializer):
	class Meta:
		model = Place
		fields = '__all__'

class PassengerIdsSerializerBP(serializers.ModelSerializer):
	#user = UserSerializerBP(read_only=True)
	class Meta:
		model = Passenger
		fields = '__all__'

class PassengerSerializerBP(serializers.ModelSerializer):
	user = UserSerializerBP(read_only=True)
	class Meta:
		model = Passenger
		fields = '__all__'

class VehicleSerializerBP(serializers.ModelSerializer):
	class Meta:
		model = Vehicle
		fields = '__all__'

class DriverSerializerBP(serializers.ModelSerializer):
	user = UserSerializerBP(read_only=True)
	vehicles = VehicleSerializerBP(read_only=True,many=True)
	class Meta:
		model = Driver
		fields = '__all__'

class TripSerializerBP(serializers.ModelSerializer):
	passengers = serializers.SerializerMethodField(read_only=True)
	driver = DriverSerializerBP(read_only=True)
	vehicle = VehicleSerializerBP(read_only=True)
	#place_destination = PlaceSerializerBP(read_only=True)
	class Meta:
		model = Trip
		fields = '__all__'
	
	def get_passengers(self, obj):
		usuarios = obj.passengers.all()
		tripid = obj.id
		pasajeros = []
		for usuario in usuarios:
			pasajeros.append(usuario.passenger_set.get(trip=tripid))
		serializer = PassengerSerializerBP(pasajeros, many=True)
		return serializer.data

class TripIdsSerializerBP(serializers.ModelSerializer):
	class Meta:
		model = Trip
		fields = '__all__'

class TripRequestSerializerBP(serializers.ModelSerializer):
	user = UserSerializerBP(read_only=True)
	place_origin = PlaceSerializerBP(read_only=True)
	place_destination = PlaceSerializerBP(read_only=True)
	trip = TripSerializerBP(read_only=True)
	class Meta:
		model = TripRequest
		fields = '__all__'




"""
class (serializers.ModelSerializer):
	class Meta:
		model =
		fields = '__all__'
"""





class UserSerializerJR(serializers.ModelSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'first_name',
                  'last_name', 'email', 'token')
        extra_kwargs = {
        'password': {'write_only': True, 'required': False},
        }

    def get_token(self, obj):
        try:
            token = self.context.get('token', obj.auth_token.key)
        except:
            token = None
        return token



class ProfileSerializerJR(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Driver
        fields = ('user', 'lat_home', 'lon_home', 'created_at', 'modified_at')

    def get_user(self, obj):
        key = obj.user.auth_token.key
        serializer = UserSerializerJR(
            obj.user,
            context={'token':key}
        )
        return serializer.data


class TagSerializerJR(serializers.ModelSerializer):
	class Meta:
		model = Tag
		fields = '__all__'


class VehicleBrandSerializerJR(serializers.ModelSerializer):
	class Meta:
		model = VehicleBrand
		fields = '__all__'


class VehicleModelSerializerJR(serializers.ModelSerializer):
	class Meta:
		model = VehicleModel
		fields = '__all__'


class PlaceSerializerJR(serializers.ModelSerializer):
	class Meta:
		model = Place
		fields = '__all__'


class VehicleSerializerJR(serializers.ModelSerializer):
    brand = VehicleBrandSerializerJR()
    model = VehicleModelSerializerJR()

    class Meta:
        model = Vehicle
        fields = '__all__'


class DriverSerializerJR(serializers.ModelSerializer):
    user = serializers.SerializerMethodField(read_only=True)
    vehicles = VehicleSerializerJR(read_only=True,many=True)

    class Meta:
        model = Driver
        fields = ('user', 'vehicles', 'photo', 'created_at', 'modified_at')

    def get_user(self, obj):
        key = self.context.get('key', obj.user.auth_token.key)
        serializer = UserSerializerJR(
            obj.user,
            context={'token':key}
        )
        return serializer.data


class Trip2SerializerJR(serializers.ModelSerializer):
    driver = DriverSerializerJR(read_only=True)
    vehicle = VehicleSerializerJR(read_only=True)
    place_origin = PlaceSerializerJR(read_only=True)
    place_destination = PlaceSerializerJR(read_only=True)
    created_user = UserSerializerJR(read_only=True)
    modified_user = UserSerializerJR(read_only=True)

    class Meta:
        model = Trip
        fields = ('driver', 'vehicle', 'place_origin', 'place_destination', 'created_user', 'modified_user')


class ShiftSerializerJR(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField(read_only=True)
    user = UserSerializerJR(read_only=True)
    created_user = UserSerializerJR(read_only=True)
    modified_user = UserSerializerJR(read_only=True)

    class Meta:
        model = Shift
        fields = '__all__'

    def get_tags(self, obj):
        tags = obj.tags.all()
        serializer = TagSerializerJR(tags, many=True)
        return serializer.data


class TripRequestSerializerJR(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField(read_only=True)
    user = UserSerializerJR(read_only=True)
    trip = Trip2SerializerJR(read_only=True)
    shift = ShiftSerializerJR(read_only=True)
    place_origin = PlaceSerializerJR(read_only=True)
    place_destination = PlaceSerializerJR(read_only=True)
    created_user = UserSerializerJR(read_only=True)
    modified_user = UserSerializerJR(read_only=True)

    class Meta:
        model = TripRequest
        fields = '__all__'

    def get_tags(self, obj):
        tags = obj.tags.all()
        serializer = TagSerializerJR(tags, many=True)
        return serializer.data


class PassengerSerializerJR(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField(read_only=True)
    user = UserSerializerJR(read_only=True)
    trip = Trip2SerializerJR(read_only=True)
    trip_request = TripRequestSerializerJR(read_only=True)
    created_user = UserSerializerJR(read_only=True)
    modified_user = UserSerializerJR(read_only=True)

    class Meta:
        model = Passenger
        fields = '__all__'

    def get_tags(self, obj):
        tags = obj.tags.all()
        serializer = TagSerializerJR(tags, many=True)
        return serializer.data


class TripSerializerJR(serializers.ModelSerializer):
    passengers = serializers.SerializerMethodField(read_only=True)
    driver = DriverSerializerJR(read_only=True)
    vehicle = VehicleSerializerJR(read_only=True)
    place_origin = PlaceSerializerJR(read_only=True)
    place_destination = PlaceSerializerJR(read_only=True)
    created_user = UserSerializerJR(read_only=True)
    modified_user = UserSerializerJR(read_only=True)

    class Meta:
        model = Trip
        fields = '__all__'

    def get_passengers(self, obj):
        users = obj.passengers.all()
        passengers = []

        for user in users:
            passengers.append(user.passenger_set.get(trip=obj.id))
        serializer = PassengerSerializerJR(passengers, many=True)
        return serializer.data

    '''
    def get_passengers(self, obj):
        passengers = obj.passengers.all()
        serializer = UserSerializerBP(passengers, many=True)
        return serializer.data
    '''