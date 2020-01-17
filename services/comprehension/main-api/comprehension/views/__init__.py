from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from ..models.activity import Activity


class ApiView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, *args, **kwargs):
<<<<<<< HEAD
        return super().dispatch(*args, **kwargs)
=======
        super().dispatch(*args, **kwargs)
>>>>>>> d85bb9af97587a5ad77c7bc05ebf962d0ba73d4d


def index(request):
    return HttpResponse("This could return something helpful!")


def list_activities(request):
    activities = Activity.objects.all()
    return HttpResponse(f"There are {len(activities)} Activities in the DB")
