#npm install
#npm rebuild node-sass
#rm app/assets/webpack/* || true && cd client && nohup npm run build:dev:client && nohup npm run build:dev:server > npm_build_log.out 2>&1 &
#sleep 30
#mkdir -p public/javascripts/
#cp app/assets/javascripts/application.js public/javascripts/
heroku container:push web -a quill-lms-production-docker-2
heroku container:release -a quill-lms-production-docker-2 web
