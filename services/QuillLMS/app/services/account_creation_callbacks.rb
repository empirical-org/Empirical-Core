class AccountCreationCallbacks
  # cant necessarily attach this directly as callback on User.rb because in some cases this shouldnt fire (student invited by teacher)

  def initialize(user, ip)
    @user = user
    @ip = ip
  end

  def trigger
    # dont combine these into one worker, because
    # each worker continuously retries if it fails (so you dont want to repeatedly do the one which doesnt fail)
    if @user.role == 'teacher'
      WelcomeEmailWorker.perform_async(@user.id)
    end
    AccountCreationWorker.perform_async(@user.id)
    IpLocationWorker.perform_async(@user.id, @ip) if @user.role != 'student'
  end

end
