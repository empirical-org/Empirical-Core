nohup bundle exec puma -C config/puma.rb > rake.out 2>&1 &
sed -e "s@/webpack/home@$DEFAULT_URL/webpack/home@g" -i public/webpack/manifest.json
sed -e "s@/webpack/vendor@$DEFAULT_URL/webpack/vendor@g" -i public/webpack/manifest.json
tail -f rake.out
