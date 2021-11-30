# frozen_string_literal: true

FactoryBot.define do

  factory "Doorkeeper::Application", aliases: [:oauth_application] do

    sequence(:name) { |i| "oauth app #{i}" }
    sequence(:uid)  { |i| "oauth_app_#{i}" }

    redirect_uri "https://localhost:3000/oauth/callback"
  end
end
