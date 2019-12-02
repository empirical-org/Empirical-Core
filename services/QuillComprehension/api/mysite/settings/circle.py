from os import environ

from .base import *

# [START dbconfig]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': environ['PG_DB'],
        'USER': environ['PG_USER'],
        'PASSWORD': environ['PG_PASS'],
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
