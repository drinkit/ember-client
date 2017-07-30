#!/bin/bash
ember build -dev
rsync -a --exclude=robots.txt dist/* ../EmberDrinkItDeploy
cd ../EmberDrinkItDeploy/ && git add -A -v
cd ../EmberDrinkItDeploy/ && git commit -m "New version $(date)"
cd ../EmberDrinkItDeploy/ && git push
cd ../EmberDrinkIt/
ember build -prod
rsync -a --exclude=robots.txt dist/* ../drinkItProd
