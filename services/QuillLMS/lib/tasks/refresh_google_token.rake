desc "This task refreshes google access tokens and is called by the Heroku scheduler add-on"
task :refresh_access_token => :environment do
  puts "Refreshing google access tokens..."
  User.where.not(google_id: [nil, ""]).each do |user|
  	http_client = HTTParty
    client = GoogleIntegration::RefreshAccessToken.new(user, http_client)
    client.refresh
  end
end
