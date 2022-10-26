# frozen_string_literal: true

module GoogleIntegration
  class GoogleIdTransferrer < ApplicationService
    attr_reader :calling_user_id, :from_user, :from_user_google_id, :to_user, :to_user_google_id

    def initialize(calling_user_id, from_user, to_user)
      @calling_user_id = calling_user_id
      @from_user = from_user
      @from_user_google_id = from_user.google_id
      @to_user = to_user
      @to_user_google_id = to_user.google_id
    end

    def run
      return if from_user_google_id.nil?

      ActiveRecord::Base.transaction do
        unlink_from_user
        log_unlink
        link_to_user
        log_link
      end
    end

    private def link_to_user
      to_user.update!(google_id: from_user_google_id)
    end

    private def log_link
      ChangeLog.create!(
        action: ChangeLog::GOOGLE_IMPORT_ACTIONS[:linked_google_id],
        changed_attribute: :google_id,
        changed_record: to_user,
        explanation: caller_locations[0].to_s,
        new_value: from_user_google_id,
        previous_value: to_user_google_id,
        user_id: calling_user_id
      )
    end

    private def log_unlink
      ChangeLog.create!(
        action: ChangeLog::GOOGLE_IMPORT_ACTIONS[:unlinked_google_id],
        changed_attribute: :google_id,
        changed_record: from_user,
        explanation: caller_locations[0].to_s,
        new_value: nil,
        previous_value: from_user_google_id,
        user_id: calling_user_id
      )
    end

    private def unlink_from_user
      from_user.update!(google_id: nil)
    end
  end
end
