from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^activities$', views.show_activities, name='show_activities'),
]
