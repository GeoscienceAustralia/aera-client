# aera-client [![Build Status](https://travis-ci.org/GeoscienceAustralia/aera-client.svg?branch=master)](https://travis-ci.org/GeoscienceAustralia/aera-client)

Web client for AERA project

`gulp run` starts the server running and watches scss files, converts them to css and concatenates them into a
single aera.css file (which is linked in index.html). This file is not minified and there is no live-reload on the
server

`gulp test` runs unit & functional tests. To just run one or the other use `test-unit` or `test-functional`

`gulp build` concatenates, uglifies, minifies etc and moves everything to the build folder