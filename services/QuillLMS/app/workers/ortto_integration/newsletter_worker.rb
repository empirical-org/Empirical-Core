# frozen_string_literal: true

module OrttoIntegration
  class NewsletterWorker
    include Sidekiq::Worker
    sidekiq_options queue: SidekiqQueue::LOW

    PUSHER_EVENT = 'clever-classroom-students-imported'

    def perform(user_id:, activate_newsletter:)
      user = User.find_by(id: user_id)
      return unless user

      resp = Faraday.post("https://api.newrelic.com/v2/applications/#{ENV['NEW_RELIC_APP_ID']}/deployments.json") do |req|
      req.headers['X-Api-Key'] = ENV['NEW_RELIC_REST_API_KEY']
      req.headers['Content-Type'] = 'application/json'
      req.body = {
        "deployment": {
          "revision": "Commit: #{params['head_long']} | Heroku release: #{params['release']}",
          "changelog": params['git_log'],
          "description": params['head_long'],
          "user": params['user'],
          "timestamp": Time.current.utc
        }
      }.to_json


      TeacherClassroomsStudentsImporter.run(teacher, classroom_ids)
      PusherTrigger.run(teacher_id, PUSHER_EVENT, "clever classroom students imported for #{teacher_id}.")
    rescue StandardError => e
      NewRelic::Agent.notice_error(e, user_id: teacher_id)
    end
  end
end
