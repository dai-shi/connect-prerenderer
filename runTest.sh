#!/bin/sh

./node_modules/.bin/mocha || exit 1

node ./test/server/app.js &
PID=$!

./node_modules/karma/bin/karma start ./test/e2e.conf
RES1=$?
./node_modules/karma/bin/karma start ./test/e2e-2.conf
RES2=$?

kill $PID

exit $RES1 || $RES2
