class UserMailerPreview < ActionMailer::Preview

  def welcome_email
    UserMailer.welcome_email(User.find_by(email: 'marcello.sachs@gmail.com')).tap do |email|
      Premailer::Rails::Hook.delivering_email(email)
    end
  end
end
