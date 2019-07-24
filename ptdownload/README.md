# Papertrail S3 log downloader

1. Get Your Papertrail token from https://papertrailapp.com/account/profile
2. Profit!

~~~sh
# download logs from last 30 days
PAPERTRAIL_TOKEN={YOUR TOKEN} papertrail-download-daily.sh 30

# download logs from last 30 days & filter each through ./filter.sh
PAPERTRAIL_TOKEN={YOUR TOKEN} papertrail-download-daily.sh 30 ./filter.sh

# download logs from last 168 hours
PAPERTRAIL_TOKEN={YOUR TOKEN} papertrail-download-hourly.sh 168
~~~
