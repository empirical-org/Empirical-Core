# frozen_string_literal: true

module OrttoIntegration
  class NewsletterWorker
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::LOW


    def perform(user_email:, subscribe: )
      ## START HERE
      # user = User.find_by(id: user_id)
      # return unless user

      # resp = Faraday.post("https://api.newrelic.com/v2/applications/#{ENV['NEW_RELIC_APP_ID']}/deployments.json") do |req|
      # req.headers['X-Api-Key'] = ENV['NEW_RELIC_REST_API_KEY']
      # req.headers['Content-Type'] = 'application/json'
      # req.body = {

      # }.to_json


    rescue StandardError => e
      # ErrorNotifier #NewRelic::Agent.notice_error(e, user_id: teacher_id)
    end
  end
end
