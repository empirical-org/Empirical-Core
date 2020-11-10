class CompleteAccountCreation

  def initialize(user, ip)
    @user = user
    @ip = ip
  end

  def call
    IpLocationWorker.perform_async(user.id, ip) unless user.student?
    AccountCreationWorker.perform_async(user.id)
    true
  end

  private

  attr_reader :user, :ip
end
