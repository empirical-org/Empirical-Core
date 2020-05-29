from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.response import Response

from ..models.activity import Activity
from ..models.turking_round import TurkingRound
from ..serializers import (ActivityListSerializer,
                           ActivitySerializer,
                           TurkingRoundSerializer)


class ActivityViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows activities to be viewed or edited.
    """
    queryset = Activity.objects.all().order_by('created_at')
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def list(self, request, format=None):
        """
        Defined to override the default behavior because we use a different
        serializer when getting lists of Activities than when looking at
        details
        """
        serializer = ActivityListSerializer(self.queryset, many=True)
        return Response(serializer.data)


class TurkingRoundViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows activities to be viewed or edited.
    """
    queryset = TurkingRound.objects.all().order_by('created_at')
    serializer_class = TurkingRoundSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
