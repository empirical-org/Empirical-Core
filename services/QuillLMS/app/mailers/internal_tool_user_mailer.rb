# frozen_string_literal: true

class InternalToolUserMailer < UserMailer
  include EmailApiHelper
  include ActionView::Helpers::NumberHelper

  default from: "The Quill Team <hello@quill.org>"

  def admin_account_created_email(user, school_name)
    @user = user
    @school_name = school_name
    @set_password_link = link_for_setting_password('school admin')
    mail to: user.email, subject: "[Action Required] #{user.first_name}, a Quill school admin account was created for you"
  end

  def made_school_admin_email(user, school_name)
    @user = user
    @school_name = school_name
    mail to: user.email, subject: "#{user.first_name}, you are now a Quill admin for #{school_name}"
  end

  def made_school_admin_link_school_email(user, school)
    @user = user
    @school = school
    @link_school_link = "#{ENV['DEFAULT_URL']}/teachers/#{@user.id}/schools/#{@school.id}"
    mail to: user.email, subject: "#{user.first_name}, you are now a Quill admin for #{school.name}"
  end

  def made_school_admin_change_school_email(user, new_school, existing_school)
    @user = user
    @new_school = new_school
    @existing_school = existing_school
    @link_school_link = "#{ENV['DEFAULT_URL']}/teachers/#{@user.id}/schools/#{@new_school.id}"
    mail to: user.email, subject: "#{user.first_name}, you are now a Quill admin for #{new_school.name}"
  end

  def district_admin_account_created_email(user, district_name)
    @user = user
    @district_name = district_name
    @set_password_link = link_for_setting_password('district admin')
    mail to: user.email, subject: "[Action Required] #{user.first_name}, a Quill district admin account was created for you"
  end

  def made_district_admin_email(user, district_name)
    @user = user
    @district_name = district_name
    @set_password_link = link_for_setting_password('district admin')
    mail to: user.email, subject: "#{user.first_name}, you are now a Quill admin for #{district_name}"
  end

end
