./bin/establish_proxy.sh &
# Wait for the proxy to finish setting up
sleep 3
./manage.py runserver
