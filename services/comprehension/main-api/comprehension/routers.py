from rest_framework import routers

from .views.api import ActivityViewSet


ApiRouter = routers.DefaultRouter()
ApiRouter.register(r'activities', ActivityViewSet)
