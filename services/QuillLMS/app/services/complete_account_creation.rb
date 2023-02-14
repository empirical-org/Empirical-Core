# frozen_string_literal: true

class CompleteAccountCreation

  def initialize(user, ip)
    @user = user
    @ip = ip
  end

  def call
    if user.admin?
      AdminInfo.create(admin_id: user.id, approval_status: AdminInfo::SKIPPED) # setting approval status to SKIPPED to ensure that self-created admins who exit or bypass the school verification step will have to complete it eventually
      user.require_email_verification unless user.clever_id || user.google_id
    end

    IpLocationWorker.perform_async(user.id, ip) unless user.student?
    AccountCreationWorker.perform_async(user.id)
    true
  end

  attr_reader :user, :ip
  private :user
  private :ip
end
