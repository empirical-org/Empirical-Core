from rest_framework import routers

from .views.api import ActivityViewSet, TurkingRoundViewSet


ApiRouter = routers.DefaultRouter()
ApiRouter.register(r'activities', ActivityViewSet, 'activities')
ApiRouter.register(r'turking', TurkingRoundViewSet, 'turking')
