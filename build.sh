#!/bin/bash
ember build -prod
cp -R dist/* ../EmberDrinkItDeploy/
cd ../EmberDrinkItDeploy/ && git add -A -v
cd ../EmberDrinkItDeploy/ && git commit -m "New version $(date)"
cd ../EmberDrinkItDeploy/ && git push
