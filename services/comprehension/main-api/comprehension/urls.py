from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^activities$', views.list_activities, name='list_activities'),
    url(r'^activities/(?P<id>.*)$', views.show_activity, name='show_activity'),
    url(r'^first_pass$', views._first_pass, name='first_pass'),
    url(r'^second_pass$', views.second_pass, name='second_pass')
]
