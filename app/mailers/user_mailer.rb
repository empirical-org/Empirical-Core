class UserMailer < ActionMailer::Base
  default from: "empiricalgrammar@gmail.com"

  def welcome_email(user)
    @user = user
    @url  = "http://localhost:3000/users/activate_email/" + user.email_activation_token
    mail(:to => user.email, :subject => "Please register")
  end
end
