#!/usr/bin/env bash
aws s3 cp s3://smallest-bucket-in-history/aera-client/ /tmp --recursive --exclude "*" --include "*.zip"
mkdir /tmp/aera
cd /tmp
unzip aera.zip -d aera
mkdir /var/www/aera
cp -r aera/* /var/www/aera
