class UserMailer < ActionMailer::Base
  default from: "empiricalgrammar@gmail.com"

  def welcome_email(user)
    @user = user
    mail to: user.email, subject: "Welcome to Quill!"
  end
end
