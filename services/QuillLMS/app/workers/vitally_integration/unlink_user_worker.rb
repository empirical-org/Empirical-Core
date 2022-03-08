# frozen_string_literal: true

module VitallyIntegration
  class UnlinkUserWorker
    include Sidekiq::Worker

    def perform(user_id, school_id)
      return if user_id.nil? || school_id.nil?

      VitallyApi.new.unlink(
        userId: user_id,
        accountId: school_id,
        messageId: SecureRandom.uuid
      )
    end
  end
end
