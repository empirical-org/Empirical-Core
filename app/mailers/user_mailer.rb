class UserMailer < ActionMailer::Base
  default from: "empiricalgrammar@gmail.com"

  def welcome_email(user)
    @user = user
    mail to: user.email, subject: "Welcome to Empirical Grammar!"
  end

  def test_email
  	mail(:to => "michael.zemel@gmail.com", :subject => "Test")
  end
end
