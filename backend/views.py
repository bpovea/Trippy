from django.shortcuts import render
from .models import TripRequest, Place, Trip, Driver, Passenger, Vehicle
from django.http import JsonResponse
from rest_framework.decorators import api_view
from .serializers import TripRequestSerializerBP, TripSerializerBP, TripIdsSerializerBP, DriverSerializerBP, VehicleSerializerBP
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt 
@api_view(['GET', 'POST'])
def tripRequestList(request):
  if request.method == 'GET':
    tripRequest = TripRequest.objects.all()
    serializer = TripRequestSerializerBP(tripRequest, many = True)
    return JsonResponse(serializer.data, safe = False)

  elif request.method == 'POST':
    serializer = TripRequestSerializerBP(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
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
        return Response(
            serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        serializer = TripIdsSerializerBP(trip)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = TripIdsSerializerBP(trip, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(
                serilizer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
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
                serilizer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        cliente.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
"""