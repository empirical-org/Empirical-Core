export APP_BUNDLE_JS=$(ls -ltrah public/webpack/app-bundle-*.js | tail -1 | awk -F "/" '{print $3}')
sed -e "s@app-bundle.*.js\"@$APP_BUNDLE_JS\"@g" -i public/webpack/manifest.json
export APP_BUNDLE_CSS=$(ls -ltrah public/webpack/app-bundle-*.css | tail -1 | awk -F "/" '{print $3}')
sed -e "s@app-bundle.*.css\"@$APP_BUNDLE_CSS\"@g" -i public/webpack/manifest.json
nohup bundle exec puma -C config/puma.rb > rake.out 2>&1 &
#nohup rails s > rake.out 2>&1 &
sed -e "s@/webpack@$DEFAULT_URL/webpack@g" -i public/webpack/manifest.json
mkdir -p public/javascripts/
cp app/assets/javascripts/application.js public/javascripts/
tail -f rake.out
