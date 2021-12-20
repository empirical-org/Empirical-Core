# frozen_string_literal: true

class PurgeExpiredAuthCredentialWorker
  include Sidekiq::Worker
  sidekiq_options queue: SidekiqQueue::CRITICAL_EXTERNAL

  def perform(auth_credential_id)
    AuthCredential.find_by(id: auth_credential_id)&.destroy
  end
end
