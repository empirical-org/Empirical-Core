React::Rails::HotLoader::AssetChangeSet.asset_glob = "**/*.{js,rb}*" # I <3 Opal

if Rails.env.development?
  # Starts a websocket server to push changes:
  React::Rails::HotLoader.start()
end
