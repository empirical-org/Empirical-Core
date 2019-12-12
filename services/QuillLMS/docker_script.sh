nohup bundle exec puma -C config/puma.rb > rake.out 2>&1 &
#nohup rails s > rake.out 2>&1 &
sed -e "s@/webpack@$DEFAULT_URL/webpack@g" -i public/webpack/manifest.json
mkdir -p public/javascripts/
cp app/assets/javascripts/application.js public/javascripts/
tail -f rake.out
