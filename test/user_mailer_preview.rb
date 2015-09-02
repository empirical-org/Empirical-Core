class UserMailerPreview < ActionMailer::Preview

  def welcome_email
    UserMailer.welcome_email(User.find_by email: 'marcello.sachs@gmail.com')
  end

end