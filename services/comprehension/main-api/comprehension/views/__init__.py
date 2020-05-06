from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from ..models.activity import Activity
from rest_framework import viewsets
from rest_framework import permissions
from ..serializers import ActivitySerializer

class ApiView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)


def index(request):
    return HttpResponse("This could return something helpful!")


def list_activities(request):
    activities = Activity.objects.all()
    return HttpResponse(f"There are {len(activities)} Activities in the DB")

class ActivityViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows activities to be viewed or edited.
    """
    queryset = Activity.objects.all().order_by('-id')
    serializer_class = ActivitySerializer
    permission_classes = [permissions.IsAuthenticated]
