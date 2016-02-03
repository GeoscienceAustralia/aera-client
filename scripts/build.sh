#!/bin/bash
./node_modules/.bin/gulp clean
./node_modules/.bin/gulp test
./node_modules/.bin/gulp build
cp appspec.yml build/webapp/
mkdir release
cd build/webapp/
zip -r ../../release/aera.zip *