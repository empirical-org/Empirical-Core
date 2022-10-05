# frozen_string_literal: true

class LogGoogleAuthCredentialWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

  def perform(user_id, auth_credential_id, refresh_token_expires_at)
    ChangeLog.create!(
      action: ChangeLog::USER_ACTIONS[:google_access_expired_reset_session],
      changed_record: User.find_by(id: user_id),
      explanation: refresh_token_expires_at,
      previous_value: auth_credential_id
    )
  end
end
