from django.conf.urls import url
from django.urls import include, path

from . import views
from .views.activity import ActivityView
from .views.feedback_history import FeedbackHistoryView
from .views.feedback_rules import RulesBasedFeedbackView
from .views.ml_feedback import MLFeedbackView
from .views.rule import RuleView
from .views.plagiarism import PlagiarismFeedbackView
from .views.session_feedback_history import SessionFeedbackHistoryView
from .views.session_feedback_history_detail import (
    SessionFeedbackHistoryDetailView
)
from .models.rule_set import RuleSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'activities_api', views.ActivityViewSet)

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^activities$', views.list_activities, name='list_activities'),
    url(r'^activities/(?P<id>.*)$', ActivityView.as_view(),
        name='show_activity'),
    url(r'^rules$', RuleView.count_rules, name='count_rules'),
    url(r'^feedback/ml$', MLFeedbackView.as_view(),
        name='get_ml_feedback'),
    url(r'^feedback/history$', FeedbackHistoryView.as_view(),
        name='save_feedback_history'),
    url(r'^feedback/rules/first_pass$',
        RulesBasedFeedbackView.as_view(pass_order=RuleSet.PASS_ORDER.FIRST),
        name='get_rules_based_feedback_first_pass'),
    url(r'^feedback/rules/second_pass$',
        RulesBasedFeedbackView.as_view(pass_order=RuleSet.PASS_ORDER.SECOND),
        name='get_rules_based_feedback_second_pass'),
    url(r'^feedback/plagiarism$', PlagiarismFeedbackView.as_view(),
        name='get_plagiarism_feedback'),
    url(r'^session_history$',
        SessionFeedbackHistoryView.as_view(),
        name='get_session_feedback_history'),
    url(r'^session_history/(?P<session_id>.*)$',
        SessionFeedbackHistoryDetailView.as_view(),
        name='get_session_feedback_history_detail'),
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
