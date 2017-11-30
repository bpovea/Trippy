from django.utils.translation import ugettext as _

from rest_framework import viewsets
from rest_framework import status
from rest_framework.authentication import TokenAuthentication, SessionAuthentication
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from fcm_django.models import FCMDevice

from .viewsets import *
from .serializers import *
from .filters import *


class CustomObtainAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        """
            Login
            Ex:
                request  --> {
                    'username': <username string>,
                    'password': <password string>,
                    'role': <role string>
                    'device': {
                        'name': <device_name string>,
                        'registration_id': <fcm_token string>,
                        'type': <type string> 
                    }
                }
                response --> {
                    'is_error': True/False,
                    'msg': <msg string>,
                    'data': <object>
                }
        """
        msg = ''
        response = {'is_error': True}
        try:
            data = request.data
            serializer = self.serializer_class(data=data)
            serializer.is_valid(raise_exception=True)
        except:
            response['is_error'] = True
            response['msg'] = _('Usuario y contraseña incorrectos')
            return Response(response)

        try:
            # Get user
            user = serializer.validated_data['user']
 
            # Get role
            role = data.get('role', '')
            assert role != 'driver' or role != 'client',\
                "No se ha encontrado un rol para el usuario"
 
            # Get or create device
            registration_id = data.get('registration_id', '')
            type = data.get('type', '')
            device = FCMDevice.objects.get_or_create(
                user=user,
                registration_id=registration_id,
                type=type
            )
 
            # Get or create token
            token, created = Token.objects.get_or_create(user=user)
 
            if role == "driver":
                try:
                    driver = user.driver

                    # Serializer driver               
                    serializer = DriverSerializerJR(
                        driver,
                        context={'key':token.key}
                    )
                except:
                    response['msg'] = "No se encontro perfil de conductor"
                    return Response(response)
            else:
                try:
                    profile = user.profile
 
                    # Serializer profile
                    serializer = ProfileSerializerJR(
                        profile,
                        context={'key':token.key}
                    )
                except:
                    response['msg'] = "No se encontro perfil de cliente"
                    return Response(response)

            data = serializer.data
            response['is_error'] = False
            response['msg'] = _('Se ha iniciado sesión correctamente')
            response['data'] = data
        except Exception as e:
            response['msg'] = _('Ha ocurrido un error, intente nuevamente')

        return Response(response)


class TripViewSetJR(viewsets.ModelViewSet):
    serializer_class = TripSerializerJR
    authentication_classes = (SessionAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    filter_class = TripFilter

    def get_queryset(self):
        user = self.request.user
        try:
            queryset = user.driver.trip_set.all()
        except:
            queryset = Trip.objects.filter(passenger__user=user)
        return queryset

    def perform_create(self, serializer):
        serializer.save(status=Trip.FINISHED)

    def perform_update(self, serializer):
        serializer.save(statu=Trip.ON_TRIP)

class VehicleViewSetJR(viewsets.ModelViewSet):
    serializer_class = VehicleSerializerJR
    authentication_classes = (SessionAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        try:
            queryset = user.driver.vehicles.all()
        except: pass
        return queryset
