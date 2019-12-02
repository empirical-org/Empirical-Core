python manage.py collectstatic
gsutil rsync -R static/ gs://quill-comprehension-api/static
gcloud app deploy
