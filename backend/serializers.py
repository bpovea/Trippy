from rest_framework import serializers
from .models import TripRequest, Place, Trip, Driver, Passenger, Vehicle, Profile
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