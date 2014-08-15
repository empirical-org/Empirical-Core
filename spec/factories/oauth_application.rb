FactoryGirl.define do

  factory "Doorkeeper::Application", aliases: [:oauth_application] do

    sequence(:name) { |i| "oauth app #{i}" }
    sequence(:uid)  { |i| "oauth_app_#{i}" }

    redirect_uri  "http://localhost:3000/oauth/callback"
  end
end
