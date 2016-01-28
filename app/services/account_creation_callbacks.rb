class AccountCreationCallbacks
  # cant necessarily attach this directly as callback on User.rb because in some cases this shouldnt fire (student invited by teacher)

  def initialize(user)
    @user = user
  end

  def trigger
    # dont combine these into one worker, because
    # each worker continuously retries if it fails (so you dont want to repeatedly do the one which doesnt fail)
    IpLocationWorker.perform_async(user.id, remote_ip) if user.role != 'student'
    WelcomeEmailWorker.perform_async(@user.id)
    AccountCreationWorker.perform_async(@user.id)
  end

end
