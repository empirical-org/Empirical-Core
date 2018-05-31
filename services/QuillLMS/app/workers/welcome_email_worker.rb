class WelcomeEmailWorker
  include Sidekiq::Worker

  def perform(id)
    @user = User.find(id)
    @user.send_welcome_email
  end
end
