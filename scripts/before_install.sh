#!/usr/bin/env bash
aws s3 cp s3://smallest-bucket-in-history/aera-client/ /tmp --recursive --exclude "*" --include "*.zip"
rm -rf /tmp/aera
mkdir /tmp/aera
cd /tmp
unzip aera.zip -d aera
rm -f aera.zip
mkdir /var/www/html/aera
cp -r aera/* /var/www/html/aera
