#!/bin/bash

yarn build

rm -rf ../wise-cs-web/static/*
# Move the build files to the Flask static folder
mv build/static/* ../wise-cs-web/static/
mv build/* ../wise-cs-web/static/
