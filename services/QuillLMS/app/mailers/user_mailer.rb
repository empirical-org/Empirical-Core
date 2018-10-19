class UserMailer < ActionMailer::Base
  default from: 'hello@quill.org'

  COTEACHER_SUPPORT_ARTICLE = 'http://support.quill.org/getting-started-for-teachers/manage-classes/how-do-i-share-a-class-with-my-co-teacher'

  def welcome_email user
    @user = user
    mail to: user.email, subject: 'Welcome to Quill!'
  end

  def invitation_to_non_existing_user invitation_email_hash
    @email_hash = invitation_email_hash.merge(support_article_link: COTEACHER_SUPPORT_ARTICLE, join_link: new_account_url).stringify_keys
    mail from: "Quill Team <hello@quill.org>", 'reply-to': @email_hash["inviter_email"], to: @email_hash["invitee_email"], subject: "#{@email_hash['inviter_name']} has invited you to co-teach on Quill.org!"
  end

  def invitation_to_existing_user invitation_email_hash
    invitation_email_hash.stringify_keys!
    @email_hash = invitation_email_hash.merge(support_article_link: COTEACHER_SUPPORT_ARTICLE,  accept_link: teachers_classrooms_url).stringify_keys
    mail from: "Quill Team <hello@quill.org>", 'reply-to': @email_hash["inviter_email"], to: @email_hash["invitee_email"], subject: "#{@email_hash['inviter_name']} has invited you to co-teach on Quill.org!"
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
    mail from: "Amr Thameen <amr.thameen@quill.org>", to: user.email, subject: "Next Steps for the Lessons in Your New Activity Pack, #{@unit.name}"
  end

  def premium_user_subscription_email(user)
    @user = user
    mail to: user.email, subject: "#{user.first_name}, your Quill account has been upgraded to Premium! ⭐️"
  end

  def premium_school_subscription_email(user, school, admin)
    @user = user
    @school = school
    @admin = admin
    mail to: user.email, subject: "#{user.first_name}, your Quill account has been upgraded to Premium! ⭐️"
  end

  def new_admin_email(user, school)
    @user = user
    @school = school
    mail from: "Becca Garrison <becca@quill.org>", to: user.email, subject: "#{user.first_name}, you are now an admin on Quill!"
  end

  def activated_referral_email(referrer_hash, referral_hash)
    @referrer = referrer_hash
    @referral = referral_hash
    mail from: "Quill Team <hello@quill.org>", 'reply-to': @referral['email'], to: @referrer['email'], subject: "#{@referral['name']} just activated their account on Quill!"
  end

  def referral_invitation_email(inviter_hash, invitee_email)
    @inviter = inviter_hash
    mail from: "Quill Team <hello@quill.org>", 'reply-to': @inviter['email'], to: invitee_email, subject: "#{@inviter['name']} invites you to join Quill.org!"
  end

  def premium_missing_school_email(user)
    @user = user
    mail to: ["Becca Garrison <becca@quill.org>", "Amr Thameen <amr@quill.org>", "Emilia Friedberg <emilia@quill.org>"], subject: "#{user.name} has purchased School Premium for a missing school"
  end

end
