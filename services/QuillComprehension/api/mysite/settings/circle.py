import os

# Ignoring style rules about importing '*' so that we can cascade
# settings values without having to re-specify all of them
from .base import *  # noqa: F401,F403

# [START dbconfig]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ['PG_DB'],
        'USER': os.environ['PG_USER'],
        'PASSWORD': os.environ['PG_PASS'],
        'PORT': '5432',
    }
}

# In the flexible environment, you connect to CloudSQL using a unix socket.
# Locally, you can use the CloudSQL proxy to proxy a localhost connection
# to the instance
DATABASES['default']['HOST'] = '/cloudsql/<your-cloudsql-connection-string>'
if os.getenv('GAE_INSTANCE'):
    pass
else:
    DATABASES['default']['HOST'] = '127.0.0.1'
# [END dbconfig]
