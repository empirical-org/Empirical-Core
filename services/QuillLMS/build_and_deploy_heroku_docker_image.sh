#!/bin/bash
  
case $1 in
  prod)
    HEROKU_APP_NAME=quill-lms-prod-docker
    ;;
  staging)
    HEROKU_APP_NAME=quill-lms-staging-docker
    ;;
  sprint)
    HEROKU_APP_NAME=quill-lms-sprint-docker
    ;;
  *)
    echo "You must provide an environment argument of 'sprint', 'staging', or 'prod'."
    exit 1
esac

#echo "PRUNING PREVIOUS DOCKER IMAGES"
#docker system prune -f -a
# create unique filename to force new docker image build
rm -rf *.uuid
echo "test" > $(uuidgen).uuid
echo "RUNNING NPM BUILD"
npm install
rm app/assets/webpack/* || true && cd client && nohup npm run build:dev:client && nohup run build:dev:server > npm_build_log.out 2>&1 &
sleep 30
mkdir -p public/javascripts/
cp app/assets/javascripts/application.js public/javascripts/
for i in `grep -rli process.env . | grep -v node_modules | grep -v build_and_deploy_heroku_docker_image.sh`; do
  sed -i '' -e "s@\`\(\${process.env.DEFAULT_URL}\)\(.*\)\`@\"https://quill-lms-sprint-docker.herokuapp.com\" + \`\2\`@g" $i
  sed -i -e "s@\"https://quill-lms-sprint-docker.herokuapp.com\" + \`\${body.redirect}\"@\"https://quill-lms-sprint-docker.herokuapp.com\" + \`\${body.redirect}\`@g" $i
  sed -i '' -e "s@{\`\(\${process.env.CDN_URL}\)\(.*\)\`}@\"https://assets.quill.org\2\"@g" $i
  sed -i '' -e "s@\`\(\${process.env.CDN_URL}\)\(.*\)\`@\"https://assets.quill.org\2\"@g" $i
done
export DOCKER_IMAGE_NAME="ruby5_3_1"
echo "BUILDING DOCKER IMAGE: $DOCKER_IMAGE_NAME"
docker build -t "$DOCKER_IMAGE_NAME" .
export RUBY_IMAGE_ID=$(docker inspect "$DOCKER_IMAGE_NAME" --format={{.Id}})
echo "TAGGING DOCKER IMAGE"
export REGISTRY_URL="registry.heroku.com/$HEROKU_APP_NAME/web"
docker tag $RUBY_IMAGE_ID $REGISTRY_URL
echo "PUSHING DOCKER IMAGE TO $REGISTRY_URL"
docker push $REGISTRY_URL
echo "RELEASING DOCKER IMAGE $DOCKER_IMAGE_NAME TO HEROKU APP: $HEROKU_APP_NAME"
export RUBY_IMAGE_ID=$(docker inspect "$DOCKER_IMAGE_NAME" --format={{.Id}})

curl -n -X PATCH "https://api.heroku.com/apps/$HEROKU_APP_NAME/formation" \
  -d '{
  "updates": [
    {
      "type": "web",
      "docker_image": "'"${RUBY_IMAGE_ID}"'",
      "command": "bash docker_script.sh"
    }
  ]
}' \
  -H "Content-Type: application/json" \
  -H "Accept: application/vnd.heroku+json; version=3.docker-releases"

printf "\nWAITING FOR DEPLOY TO COMPLETE...\n\n"
sleep 90
printf "\nDEPLOY COMPLETE\n\n"
