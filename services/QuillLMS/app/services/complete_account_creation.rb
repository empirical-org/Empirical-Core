# frozen_string_literal: true

class CompleteAccountCreation

  def initialize(user, ip)
    @user = user
    @ip = ip
  end

  def call
    # TODO send email verification worker if necessary
    AdminInfo.create(admin_id: user.id, approval_status: AdminInfo::SKIPPED) if user.admin? # setting approval status to SKIPPED to ensure that self-created admins who exit or bypass the school verification step will have to complete it eventually
    IpLocationWorker.perform_async(user.id, ip) unless user.student?
    AccountCreationWorker.perform_async(user.id)
    true
  end

  attr_reader :user, :ip
  private :user
  private :ip
end
