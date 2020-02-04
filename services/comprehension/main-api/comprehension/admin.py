from django.contrib import admin

from .models.activity import Activity, ActivityPassage, ActivityPrompt
from .models.ml_feedback import MLFeedback
from .models.ml_model import MLModel
from .models.passage import Passage
from .models.prompt import Prompt


admin.site.register(Activity)
admin.site.register(ActivityPassage)
admin.site.register(ActivityPrompt)
admin.site.register(MLFeedback)
admin.site.register(MLModel)
admin.site.register(Passage)
admin.site.register(Prompt)
