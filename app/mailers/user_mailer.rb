class UserMailer < ActionMailer::Base
  default from: 'hello@quill.org'

  def welcome_email user
    @user = user
    mail to: user.email, subject: 'Welcome to Quill!'
  end
end
