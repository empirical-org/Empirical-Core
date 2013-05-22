class UserMailer < ActionMailer::Base
  default from: "empiricalgrammar@gmail.com"

  def welcome_email(user)
    @user = user
    @url  = "http://empirical.ws/users/activate_email/" + user.email_activation_token
    mail(:to => user.email, :subject => "Please register")
  end

  def test_email
  	mail(:to => "michael.zemel@gmail.com", :subject => "Test")
  end
end
