import factory

from django.contrib.auth.models import User


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = 'FAKE_USER_NAME'
    password = 'FAKE_PASSWORD'
    is_staff = False
    is_active = True
    is_superuser = False
