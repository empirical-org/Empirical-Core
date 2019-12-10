rm -rf static/
python manage.py collectstatic
gsutil rsync -R static/ gs://comprehension-app-engine/static
gcloud app deploy
