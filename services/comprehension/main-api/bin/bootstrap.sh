#!/bin/bash

brew install wget
virtualenv -p python3.7 env
source env/bin/activate
python -m pip install --upgrade pip
wget https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-sdk-272.0.0-darwin-x86_64.tar.gz
tar xf google-cloud-sdk-272.0.0-darwin-x86_64.tar.gz --directory ~/
~/google-cloud-sdk/install.sh
rm google-cloud-sdk-272.0.0-darwin-x86_64.tar.gz
~/google-cloud-sdk/bin/gcloud init
brew install openssl
env LDFLAGS="-I/usr/local/opt/openssl/include -L/usr/local/opt/openssl/lib" pip install -r requirements.txt.dev
gcloud config set app/cloud_build_timeout 1000
