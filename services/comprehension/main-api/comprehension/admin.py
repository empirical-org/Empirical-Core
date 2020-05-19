from django.contrib import admin

from .models.activity import Activity, ActivityPassage, ActivityPrompt
from .models.feedback_history import FeedbackHistory
from .models.highlight import Highlight
from .models.ml_feedback import MLFeedback
from .models.ml_model import MLModel
from .models.passage import Passage
from .models.prompt import Prompt
from .models.prompt_entry import PromptEntry
from .models.rule import Rule
from .models.rule_set import RuleSet


admin.site.register(Activity)
admin.site.register(ActivityPassage)
admin.site.register(ActivityPrompt)
admin.site.register(FeedbackHistory)
admin.site.register(Highlight)
admin.site.register(MLFeedback)
admin.site.register(MLModel)
admin.site.register(Passage)
admin.site.register(Prompt)
admin.site.register(PromptEntry)
admin.site.register(Rule)
admin.site.register(RuleSet)
