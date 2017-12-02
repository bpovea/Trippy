from django.shortcuts import render
from .models import TripRequest, Place, Trip, Driver, Passenger, Vehicle, Profile
from .mail import send_email
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .serializers import *
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings


@csrf_exempt 
@api_view(['GET', 'POST'])
def tripRequestList(request):
  if request.method == 'GET':
    tripRequest = TripRequest.objects.filter(trip=None)
    serializer = TripRequestSerializerBP(tripRequest, many = True)
    return JsonResponse(serializer.data, safe = False)

  elif request.method == 'POST':
    serializer = TripRequestIdsSerializerBP(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        print(serializer.errors)
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt 
@api_view(['GET', 'POST'])
def tripList(request):
  if request.method == 'GET':
    trip = Trip.objects.all()
    serializer = TripSerializerBP(trip, many = True)
    return JsonResponse(serializer.data, safe = False)

  elif request.method == 'POST':
    serializer = TripIdsSerializerBP(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        print(serializer.errors)
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt 
@api_view(['GET'])
def tripListFilter(request):
  if request.method == 'GET':
    lower_limit = request.GET.get('date_start')
    upper_limit = request.GET.get('date_end')
    trip = Trip.objects.filter(date_start__range=(lower_limit, upper_limit))
    serializer = TripSerializerBP(trip, many = True)
    return JsonResponse(serializer.data, safe = False)

@csrf_exempt 
@api_view(['GET', 'POST'])
def tripIdsList(request):
  if request.method == 'GET':
    trip = Trip.objects.all()
    serializer = TripIdsSerializerBP(trip, many = True)
    return JsonResponse(serializer.data, safe = False)

@csrf_exempt
@api_view(['GET', 'PUT', 'DELETE'])
def tripsDetail(request, pk):
    try:
        trip = Trip.objects.get(pk=pk)
    except trip.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = TripSerializerBP(trip)
        return Response(serializer.data)

    elif request.method == 'PUT': ##Corregir##############################################################################
        notified = request.data.get('notified')
        serializer = TripIdsSerializerBP(trip, data={'notified':notified}, partial=True)
        if serializer.is_valid():
            users = trip.passengers.all()
            for user in users:
                body = """Estimado/a %s %s\n\nNos complace informarle que ha sido asignado a la ruta con el chofer: %s %s.\n\nLa hora prevista para recogerle será: %s y la hora prevista para su llegada a su destino es: %s.\n\nGracias por utilizar nuestro servicio.\n"""%(user.first_name,user.last_name,trip.driver.user.first_name,trip.driver.user.last_name,str(trip.time_start),str(trip.time_end))
                recipient = [user.email]
                cc = []
                if(user.email != ""):
                    print("enviando "+user.first_name)
                    send_email(settings.EMAIL,
                               settings.PASSWORD_EMAIL,
                               recipient, 
                               cc,
                               'Información de ruta asignada', 
                               body)
            user = trip.driver.user
            devices = user.fcmdevice_set.all()
            devices.send_message("Nueva Asignación", "Se ha agregado o actualizado una ruta a su usuario")
            devices.send_message(data={"trip": True})

            print("enviado")

            serializer.save()
            return Response(serializer.data)
        else:
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        passengers = trip.passengers.all()
        print(passengers)
        for p in passengers:
            trs = TripRequest.objects.filter(trip=trip)
            for tr in trs:
                tr.trip=None
                tr.save()
            Passenger.objects.get(user=p,trip=trip).delete()
        trip.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@csrf_exempt 
@api_view(['GET'])
def driversList(request):
  if request.method == 'GET':
    driver = Driver.objects.all()
    serializer = DriverSerializerBP(driver, many = True)
    return JsonResponse(serializer.data, safe = False)

@csrf_exempt 
@api_view(['GET'])
def vehiclesList(request):
  if request.method == 'GET':
    vehicle = Vehicle.objects.all()
    serializer = VehicleSerializerBP(vehicle, many = True)
    return JsonResponse(serializer.data, safe = False)


@csrf_exempt 
@api_view(['GET'])
def profilesList(request):
  if request.method == 'GET':
    profile = Profile.objects.all()
    serializer = ProfileSerializerBP(profile, many = True)
    return JsonResponse(serializer.data, safe = False)

@csrf_exempt 
@api_view(['GET', 'POST'])
def passengerList(request):
  if request.method == 'GET':
    passengers = Passenger.objects.all()
    serializer = PassengerSerializerBP(passengers, many = True)
    return JsonResponse(serializer.data, safe = False)

  elif request.method == 'POST':
    serializer = PassengerIdsSerializerBP(data=request.data)
    if serializer.is_valid():
        serializer.save()
        trip = Trip.objects.get(id=request.data.get('trip'))
        tripRequest = TripRequest.objects.get(id=request.data.get('trip_request'))
        print(tripRequest)
        tripRequest.trip = trip
        tripRequest.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(['GET', 'PUT', 'DELETE'])
def passengerDetail(request, pk):
    try:
        passenger = Passenger.objects.get(pk=pk)
    except passenger.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PassengerSerializerBP(passenger)
        return Response(serializer.data)

    elif request.method == 'PUT':
        trip = request.data.get('trip')
        serializer = PassengerIdsSerializerBP(passenger, data={'trip':trip}, partial=True)
        if serializer.is_valid():
            serializer.save()
            tripRequest = TripRequest.objects.get(pk=request.data.get('trip_request'))
            trip = Trip.objects.get(pk=request.data.get('trip'))
            tripRequest.trip = trip
            tripRequest.save()
            return Response(serializer.data)
        else:
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        tripRequest = passenger.trip_request
        tripRequest.trip = None
        tripRequest.save()
        passenger.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Create your views here.

# GET POST - LISTS
"""
@csrf_exempt 
@api_view(['GET', 'POST'])
def clientesList(request):
  if request.method == 'GET':
    clientes = Cliente.objects.all()
    serializer = ClienteSerializer(clientes, many = True)
    return JsonResponse(serializer.data, safe = False)

  elif request.method == 'POST':
    serializer = ClienteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST)
"""

# GET PUT DELETE for SPECIFIC OBJECT
"""
@csrf_exempt
@api_view(['GET', 'PUT', 'DELETE'])
def clientesDetail(request, pk):
    try:
        cliente = Cliente.objects.get(pk=pk)
    except cliente.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ClienteSerializer(cliente)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ClienteSerializer(cliente, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        cliente.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
"""

#additional atributes .save()
#serializer.save(owner=request.user)