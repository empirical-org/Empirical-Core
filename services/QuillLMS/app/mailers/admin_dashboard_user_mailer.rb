# frozen_string_literal: true

class AdminDashboardUserMailer < UserMailer
  include EmailApiHelper
  include ActionView::Helpers::NumberHelper

  default from: "The Quill Team <hello@quill.org>"

  def teacher_account_created_email(user, admin_name, school_name, is_reminder)
    @user = user
    @admin_name = admin_name
    @school_name = school_name
    # placeholder url-- will get updated in subsequent PR for new account setup landing page
    @set_password_link = ENV['DEFAULT_URL']
    subject = is_reminder ? "🔔 Reminder: #{user.first_name}, a Quill account was created for you" : "[Action Required] #{user.first_name}, a Quill account was created for you"
    mail to: user.email, subject: subject
  end

  def admin_account_created_email(user, admin_name, school_name, is_reminder)
    @user = user
    @admin_name = admin_name
    @school_name = school_name
    @set_password_link = ENV['DEFAULT_URL']
    subject = is_reminder ? "🔔 Reminder: #{user.first_name}, a Quill school admin account was created for you" : "[Action Required] #{user.first_name}, a Quill school admin account was created for you"
    mail to: user.email, subject: subject
  end

  def teacher_link_school_email(user, admin_name, school)
    @user = user
    @admin_name = admin_name
    @school = school
    @link_school_link = "#{ENV['DEFAULT_URL']}/teachers/#{@user.id}/schools/#{@school.id}"
    mail to: user.email, subject: "[Action Required] #{user.first_name}, please link your Quill account to #{school.name}"
  end

  def made_school_admin_email(user, admin_name, school_name)
    @user = user
    @admin_name = admin_name
    @school_name = school_name
    mail to: user.email, subject: "#{user.first_name}, you are now a Quill admin for #{school_name}"
  end

  def made_school_admin_link_school_email(user, admin_name, school)
    @user = user
    @admin_name = admin_name
    @school = school
    @link_school_link = "#{ENV['DEFAULT_URL']}/teachers/#{@user.id}/schools/#{@school.id}"
    mail to: user.email, subject: "#{user.first_name}, you are now a Quill admin for #{school.name}"
  end

  def made_school_admin_change_school_email(user, admin_name, new_school, existing_school)
    @user = user
    @admin_name = admin_name
    @new_school = new_school
    @existing_school = existing_school
    @link_school_link = "#{ENV['DEFAULT_URL']}/teachers/#{@user.id}/schools/#{@new_school.id}"
    mail to: user.email, subject: "#{user.first_name}, you are now a Quill admin for #{new_school.name}"
  end

end
