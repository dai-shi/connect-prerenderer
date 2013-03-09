#!/bin/sh

./node_modules/.bin/mocha || exit 1

node ./test/server/app.js &
PID=$!

./node_modules/testacular/bin/testacular start ./test/testacular.conf

kill $PID
