# frozen_string_literal: true

module OrttoIntegration
  class NewsletterWorker
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::LOW
    ORTTO_URL = 'https://api.ap3api.com/v1/person/merge'

    def perform(user_email, subscribe)
      user = User.find_by_email(user_email)
      return unless user

      resp = Faraday.post(ORTTO_URL) do |req|
        req.headers['X-Api-Key']    = ENV['ORTTO_API_KEY']
        req.headers['Content-Type'] = 'application/json'
        req.body = {
          'people': [
            {
              'fields': {
                'str::email': user_email,
                'bol::p': subscribe
              }
            }
          ],
          'async': false,
          'merge_by': ['str::email'],
          'merge_strategy': 2,
          'find_strategy': 0
        }.to_json
      end
    rescue StandardError => e
      ErrorNotifier.report(e)
    end
  end
end
