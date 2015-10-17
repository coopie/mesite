#!/bin/sh
rsync -r . ../openshift/blog --exclude 'node_modules' --exclude '.git'
