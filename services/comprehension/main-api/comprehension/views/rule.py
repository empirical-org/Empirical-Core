from django.http import HttpResponse

from . import ApiView
from ..models.rule import Rule


# This is a placeholder Rule View that is not called, we just need to get
# the Rule model into the import chain so Django knows about it
class RuleView(ApiView):
    def count_rules(self, request):
        rules = Rule.objects.all()
        return HttpResponse(f"There are {len(rules)} Activities in the DB")
