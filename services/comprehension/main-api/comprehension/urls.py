from django.conf.urls import url

from . import views
from .views.activity import ActivityView
from .views.feedback_rules import RulesBasedFeedbackView
from .views.ml_feedback import MLFeedbackView
from .views.rule import RuleView
from .models.rule_set import RuleSet

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^activities$', views.list_activities, name='list_activities'),
    url(r'^activities/(?P<id>.*)$', ActivityView.as_view(),
        name='show_activity'),
    url(r'^rules$', RuleView.count_rules, name='count_rules'),
    url(r'^feedback/ml/single$', MLFeedbackView.as_view(multi_label=False),
        name='get_single_label_ml_feedback'),
    url(r'^feedback/ml/multi$', MLFeedbackView.as_view(multi_label=True),
        name='get_multi_label_ml_feedback'),
    url(r'^feedback/rules/first_pass$',
        RulesBasedFeedbackView.as_view(pass_order=RuleSet.PASS_ORDER.FIRST),
        name='get_rules_based_feedback_first_pass'),
    url(r'^feedback/rules/second_pass$',
        RulesBasedFeedbackView.as_view(pass_order=RuleSet.PASS_ORDER.SECOND),
        name='get_rules_based_feedback_second_pass')
]
