from django.http import HttpResponse


def index(request):
    return HttpResponse("This could return something helpful!")
