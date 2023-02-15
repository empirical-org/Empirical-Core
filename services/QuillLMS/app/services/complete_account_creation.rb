# frozen_string_literal: true

class CompleteAccountCreation

  def initialize(user, ip)
    @user = user
    @ip = ip
  end

  def call
    perform_admin_actions if user.admin?

    IpLocationWorker.perform_async(user.id, ip) unless user.student?
    AccountCreationWorker.perform_async(user.id)
    true
  end

  def perform_admin_actions
    AdminInfo.create(admin_id: user.id, approval_status: AdminInfo::SKIPPED) # setting approval status to SKIPPED to ensure that self-created admins who exit or bypass the school verification step will have to complete it eventually
    unless user.clever_id || user.google_id
      user.require_email_verification unless user.clever_id || user.google_id
      user.user_email_verification.send_email
    end
  end

  attr_reader :user, :ip
  private :user
  private :ip
end
