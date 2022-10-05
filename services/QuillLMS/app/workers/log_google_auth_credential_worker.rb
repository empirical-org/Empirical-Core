# frozen_string_literal: true

class LogGoogleAuthCredentialWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

  def perform(user_id, auth_credential_id, refresh_token_expires_at)
    ChangeLog.create!(
      action: ChangeLog::USER_ACTIONS[:google_access_expired_reset_session],
      changed_attribute: :auth_credential,
      changed_record_id: user_id,
      changed_record_type: 'User',
      explanation: refresh_token_expires_at,
      previous_value: auth_credential_id,
      user_id: user_id
    )
  end
end
