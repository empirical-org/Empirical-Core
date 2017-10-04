class UserMailer < ActionMailer::Base
  default from: 'hello@quill.org'

  def welcome_email user
    @user = user
    mail to: user.email, subject: 'Welcome to Quill!'
  end

  def password_reset_email user
    @user = user
    mail to: user.email, subject: 'Reset your Quill password'
  end

  # Sent when an admin adds a new teacher to one of their schools.
  def account_created_email(user, temp_password, admin_name)
    @user = user
    @temp_password = temp_password
    @admin_name = admin_name
    mail to: user.email, subject: 'Welcome to Quill, An Administrator Created A Quill Account For You!'
  end

  # Sent when an admin requests an existing teacher to join one of their schools.
  def join_school_email(user, school)
    @user = user
    @school = school
    mail to: user.email, subject: "#{user.first_name}, you need to link your account to your school"
  end

  def lesson_plan_email(user, lessons, unit)
    @user = user
    @lessons = lessons
    @unit = unit
    # TODO: update this when copy exists
    mail from: 'amr.thameen@quill.org', to: user.email, subject: "Lesson Plans for Your New Unit, #{@unit.name}"
  end

end
