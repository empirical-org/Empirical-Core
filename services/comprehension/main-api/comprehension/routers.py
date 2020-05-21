from rest_framework_nested import routers
from rest_framework.urlpatterns import format_suffix_patterns
from django.conf.urls import url
from django.urls import include

from .views.api import ActivityViewSet
from .views.api import RuleSetViewSet
from .views.api import RuleViewSet


ApiRouter = routers.DefaultRouter()
ApiRouter.include_format_suffixes = False
ApiRouter.register(r'activities', ActivityViewSet, 'activities')

ActivitiesRouter = routers.NestedSimpleRouter(ApiRouter,
                                              r'activities',
                                              lookup='activities')
ActivitiesRouter.register(r'rulesets',
                          RuleSetViewSet,
                          basename='RuleSet')
RuleSetsRouter = routers.NestedSimpleRouter(ActivitiesRouter,
                                            r'rulesets',
                                            lookup='rulesets')
RuleSetsRouter.register(r'rules', RuleViewSet, basename='Rule')

apiurls = format_suffix_patterns([
    url(r'^', include(ApiRouter.urls)),
    url(r'^', include(ActivitiesRouter.urls)),
    url(r'^', include(RuleSetsRouter.urls))
], allowed=['json'])
