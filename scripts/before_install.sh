#!/usr/bin/env bash
aws s3 cp s3://smallest-bucket-in-history/aera-client/ /var/www/aera/ --recursive --exclude "*" --include "*.zip"