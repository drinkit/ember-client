#!/bin/bash
ember build -prod
rsync -a --exclude=robots.txt dist/* ../EmberDrinkItDeploy/ 
cd ../EmberDrinkItDeploy/ && git add -A -v
cd ../EmberDrinkItDeploy/ && git commit -m "New version $(date)"
cd ../EmberDrinkItDeploy/ && git push
