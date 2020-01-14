import factory
from ...models.ml_model import MLModel


class MLModelFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = MLModel

    project_id = 'project-id'
    compute_region = 'region-string'
    model_id = 'model-id-string'
