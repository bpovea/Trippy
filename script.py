import csv
from django.contrib.auth.models import User
from backend.models import *

with open('data/Usuarios.csv') as csvfile:
	reader = csv.DictReader(csvfile)
	for row in reader:
		# The header row values become your keys
		username = row['username']
		password = row['Password']
		first_name = row['first_name']
		last_name = row['second_name']
		email = row['email']
		new_user = User(username=username,first_name=first_name,last_name=last_name, email=email)
		new_user.set_password(password)
		new_user.save()
		print("user "+username+" creado.")

with open('data/Sectors.csv') as csvfile:
	reader = csv.DictReader(csvfile)
	for row in reader:
		# The header row values become your keys
		name = row['name']
		new_sector = Sector(name=name)
		new_sector.save()
		print('sector '+name+' creado.')

with open('data/Area.csv') as csvfile:
	reader = csv.DictReader(csvfile)
	for row in reader:
		# The header row values become your keys
		name = row['name']
		new_area = Area(name=name)
		new_area.save()
		print('area '+name+' creado.')


with open('data/Profiles.csv') as csvfile:
	reader = csv.DictReader(csvfile)
	for row in reader:
		# The header row values become your keys
		user = User.objects.get(id=int(row['user']))
		codigo = row['codigo']
		sector = Sector.objects.get(id=int(row['sector']))
		area = Area.objects.get(id=int(row['area']))
		address = row['addres']
		phone = row['phone']
		new_profile = Profile(user=user,address=address,sector=sector,phone=phone,codigo=codigo, area=area)
		new_profile.save()
		print('profile '+row['user']+' creado.')

with open('data/Vehicle_brand.csv') as csvfile:
	reader = csv.DictReader(csvfile)
	for row in reader:
		# The header row values become your keys
		name = row['Name(Marca)']
		new_brand = VehicleBrand(name=name)
		new_brand.save()
		print('brand '+name+' creado.')

with open('data/Vehicle_year.csv') as csvfile:
	reader = csv.DictReader(csvfile)
	for row in reader:
		# The header row values become your keys
		name = row['ano']
		new_year = VehicleYear(name=name)
		new_year.save()
		print('Year '+name+' creado.')

with open('data/Vehicle_models.csv') as csvfile:
	reader = csv.DictReader(csvfile)
	for row in reader:
		# The header row values become your keys
		name = row['Name']
		new_model = VehicleModel(name=name)
		new_model.save()
		print('Model '+name+' creado.')

with open('data/Vehicle.csv') as csvfile:
	reader = csv.DictReader(csvfile)
	for row in reader:
		# The header row values become your keys
		plate = row['Plate']
		brand = VehicleBrand.objects.get(id=int(row['Brand']))
		modelo = VehicleModel.objects.get(id=int(row['Model']))
		year = VehicleYear.objects.get(id=int(row['YEAR']))
		new_vehicle = Vehicle(plate=plate,brand=brand,model=modelo,year=year)
		new_vehicle.save()
		print(plate+' creado.')


with open('data/Drivers.csv') as csvfile:
	reader = csv.DictReader(csvfile)
	for row in reader:
		# The header row values become your keys
		user = User.objects.get(id=int(row['user']))
		vehicles = [Vehicle.objects.get(id=int(row['vehicles']))]
		new_driver = Driver(user=user,vehicles=vehicles)
		new_driver.save()
		print(row['user']+' creado.')





