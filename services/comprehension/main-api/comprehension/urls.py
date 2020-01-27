from django.conf.urls import url

from . import views
from .views.activity import ActivityView
from .views.feedback_ml_multi import MultiLabelMLFeedbackView
from .views.feedback_ml_single import SingleLabelMLFeedbackView

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^activities$', views.list_activities, name='list_activities'),
    url(r'^activities/(?P<id>.*)$', ActivityView.as_view(),
        name='show_activity'),
    url(r'^feedback/ml/single$', MultiLabelMLFeedbackView.as_view(multi_label=False),
        name='get_single_label_ml_feedback'),
    url(r'^feedback/ml/multi$', MultiLabelMLFeedbackView.as_view(multi_label=True),
        name='get_multi_label_ml_feedback'),
]
