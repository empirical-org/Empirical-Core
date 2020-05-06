from rest_framework import serializers
from .models.activity import Activity

class ActivitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Activity 
        fields = ['title', 'flags', 'passages', 'prompts']
