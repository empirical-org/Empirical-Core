class WelcomeEmailWorker
  include Sidekiq::Worker

  def perform(user)
    user.send_welcome_email
  end
end
