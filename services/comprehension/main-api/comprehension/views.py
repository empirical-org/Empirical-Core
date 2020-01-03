from django.http import HttpResponse

from .models.activity import Activity


def index(request):
    return HttpResponse("This could return something helpful!")


def show_activities(request):
    activities = Activity.objects.all()
    return HttpResponse(f"There are {len(activities)} Activities in the DB")
