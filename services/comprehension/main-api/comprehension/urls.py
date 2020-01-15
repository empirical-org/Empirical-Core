from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^activities$', views.list_activities, name='list_activities'),
    url(r'^activities/(?P<id>.*)$', views.show_activity, name='show_activity'),
    url(r'^feedback/ml/single$', views.get_single_label_ml_feedback,
        name='get_single_label_ml_feedback'),
    url(r'^feedback/ml/multi$', views.get_multi_label_ml_feedback,
        name='get_multi_label_ml_feedback'),
]
