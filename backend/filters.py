from django_filters import rest_framework as filters

from .models import *


class NumberInFilter(filters.BaseInFilter, filters.NumberFilter):
    pass


class TripFilter(filters.FilterSet):
    created_at = filters.DateFilter(lookup_expr='gte')
    status__in = NumberInFilter(name='status', lookup_expr='in')

    class Meta:
        model = Trip
        fields = ()
