from rest_framework import viewsets
from rest_framework import permissions

from ..models.activity import Activity
from ..serializers import ActivitySerializer


class ActivityViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows activities to be viewed or edited.
    """
    queryset = Activity.objects.all().order_by('-id')
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
