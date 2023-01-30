# frozen_string_literal: true

class UserMailer < ActionMailer::Base
  include EmailApiHelper
  include ActionView::Helpers::NumberHelper

  default from: "The Quill Team <hello@quill.org>"

  CONSTANTS = {
    signatures: {
      quill_team: 'The Quill Team'
    },
    links: {
      admin_dashboard: "#{ENV['DEFAULT_URL']}/teachers/admin_dashboard",
      link_account: 'https://support.quill.org/en/articles/4249829-how-do-i-link-my-account',
      premium: 'https://support.quill.org/en/collections/64410-quill-premium',
      school_dashboard: 'https://support.quill.org/en/articles/1588988-how-do-i-navigate-the-school-dashboard'
    }
  }

  before_action { @constants = CONSTANTS }

  COTEACHER_SUPPORT_ARTICLE = 'http://support.quill.org/getting-started-for-teachers/manage-classes/how-do-i-share-a-class-with-my-co-teacher'

  def invitation_to_non_existing_user invitation_email_hash
    @email_hash = invitation_email_hash.merge(support_article_link: COTEACHER_SUPPORT_ARTICLE, join_link: new_account_url).stringify_keys
    mail from: "The Quill Team <hello@quill.org>", 'reply-to': @email_hash["inviter_email"], to: @email_hash["invitee_email"], subject: "#{@email_hash['inviter_name']} has invited you to co-teach on Quill.org!"
  end

  def invitation_to_existing_user invitation_email_hash
    invitation_email_hash.stringify_keys!
    @email_hash = invitation_email_hash.merge(support_article_link: COTEACHER_SUPPORT_ARTICLE,  accept_link: teachers_classrooms_url).stringify_keys
    mail from: "The Quill Team <hello@quill.org>", 'reply-to': @email_hash["inviter_email"], to: @email_hash["invitee_email"], subject: "#{@email_hash['inviter_name']} has invited you to co-teach on Quill.org!"
  end

  def password_reset_email user
    @user = user
    mail from: "The Quill Team <hello@quill.org>", to: user.email, subject: 'Reset your Quill password'
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
    mail from: "The Quill Team <hello@quill.org>", to: user.email, subject: "Next Steps for the Lessons in Your New Activity Pack, #{@unit.name}"
  end

  def premium_user_subscription_email(user)
    @user = user
    mail from: "The Quill Team <hello@quill.org>", to: user.email, subject: "#{user.first_name}, your Quill account has been upgraded to Premium! ⭐️"
  end

  def premium_school_subscription_email(user, school, admin)
    @user = user
    @school = school
    @admin = admin
    mail from: "The Quill Team <hello@quill.org>", to: user.email, subject: "#{user.first_name}, your Quill account has been upgraded to Premium! ⭐️"
  end

  def new_admin_email(user, school)
    @user = user
    @school = school
    mail from: "The Quill Team <hello@quill.org>",  to: user.email, subject: "#{user.first_name}, you are now an admin on Quill!"
  end

  def activated_referral_email(referrer_hash, referral_hash)
    @referrer = referrer_hash
    @referral = referral_hash
    mail from: "The Quill Team <hello@quill.org>", 'reply-to': @referral['email'], to: @referrer['email'], subject: "#{@referral['name']} just activated their account on Quill!"
  end

  def referral_invitation_email(inviter_hash, invitee_email)
    @inviter = inviter_hash
    mail from: "The Quill Team <hello@quill.org>", 'reply-to': @inviter['email'], to: invitee_email, subject: "#{@inviter['name']} invites you to join Quill.org!"
  end

  def premium_missing_school_email(user)
    @user = user
    mail to: ["Quill Team <hello@quill.org>", "Emilia Friedberg <emilia@quill.org>"], subject: "#{user.name} has purchased School Premium for a missing school"
  end

  def recommendations_assignment_report_email
    @independent_less_than_ten_seconds = $redis.get("diagnostic_recommendations_under_ten_seconds_count") || 0
    @group_less_than_ten_seconds = $redis.get("lesson_diagnostic_recommendations_under_ten_seconds_count") || 0
    @independent_more_than_ten_seconds = $redis.get("diagnostic_recommendations_over_ten_seconds_count") || 0
    @group_more_than_ten_seconds = $redis.get("lesson_diagnostic_recommendations_over_ten_seconds_count") || 0
    independent_total_recommendations = @independent_more_than_ten_seconds.to_i + @independent_less_than_ten_seconds.to_i
    group_total_recommendations = @group_more_than_ten_seconds.to_i + @group_less_than_ten_seconds.to_i
    @percentage_of_independent_less_than_ten_seconds = independent_total_recommendations > 0 ? (@independent_less_than_ten_seconds.to_f/independent_total_recommendations) * 100 : 100
    @percentage_of_group_less_than_ten_seconds = group_total_recommendations > 0 ? (@group_less_than_ten_seconds.to_f/group_total_recommendations) * 100 : 100
    mail to: ["Dev Tools <devtools@quill.org>", "Emilia Friedberg <emilia@quill.org>", "Thomas Robertson <thomasrobertson@quill.org>"], subject: "Recommendations Assignment Report"
  end

  def declined_renewal_email(user)
    @user = user
    mail from: "The Quill Team <hello@quill.org>", to: user.email, subject: "Quill Premium Renewal"
  end

  def daily_stats_email(date_string)
    # Sidekiq converts variables to strings, so we recreate the Time object with the date string
    date_object = Time.parse(date_string)
    start_time = date_object.beginning_of_day
    end_time = date_object.end_of_day
    subject_date = date_object.strftime('%m/%d/%Y')

    teacher_count = User.where(role: "teacher").count
    new_premium_accounts = User.joins(:user_subscription).where(users: {role: "teacher"}).where(user_subscriptions: {created_at: start_time..end_time}).count
    conversion_rate = new_premium_accounts/teacher_count.to_f

    @current_date = date_object.strftime("%A, %B %d")
    @daily_active_teachers = User.where(role: "teacher").where(last_sign_in: start_time..end_time).size
    @daily_active_students = User.where(role: "student").where(last_sign_in: start_time..end_time).size
    @new_teacher_signups = User.where(role: "teacher").where(created_at: start_time..end_time).size
    @new_student_signups = User.where(role: "student").where(created_at: start_time..end_time).size
    @classrooms_created = Classroom.where(created_at: start_time..end_time).size
    @activities_assigned = UnitActivity.where(created_at: start_time..end_time).size
    # Sentences written is quantified by number of activities completed multiplied by 10 because
    # there are an average of 10 sentences per activity.
    @sentences_written = ActivitySession.where(completed_at: start_time..end_time).size * 10
    @diagnostics_completed = ActivitySession.where(completed_at: start_time..end_time).where(activity_id: Activity.diagnostic_activity_ids).size
    @teacher_conversion_rate = number_to_percentage(conversion_rate, precision: 5)
    @support_tickets_resolved = get_intercom_data(start_time, end_time)
    @satismeter_nps_data = get_satismeter_nps_data(start_time, end_time)
    @satismeter_comment_data = get_satismeter_comment_data(start_time, end_time)

    mail to: "team@quill.org", subject: "Quill Daily Analytics - #{subject_date}"
  end

  def ell_starter_diagnostic_info_email(name, email)
    @name = name
    mail from: "The Quill Team <hello@quill.org>", to: email, subject: "ELL Starter Diagnostic Next Steps"
  end

  def feedback_history_session_csv_download(email, data)
    attributes = %w{ Date/Time SessionID Conjunction Attempt Optimal? Completed? Response Feedback Rule}

    @csv = CSV.generate(headers: true) do |csv|
      csv << attributes
      data.each do |row|
        csv << [row["datetime"], row["session_uid"], row["conjunction"], row["attempt"], row["optimal"], row["completed"], row["response"], row["feedback"], row["name"]]
      end
    end

    attachments['feedback_sessions.csv'] = {mime_type: 'text/csv', content: @csv}
    mail from: "Quill Evidence Internal Tool", to: email, subject: "Feedback Sessions CSV Download"
  end

  private def link_for_setting_password(role)
    params = {
      accountType: role,
      adminFullName: @admin_name,
      schoolName: @school_name
    }
    @set_password_link = "#{ENV['DEFAULT_URL']}/account/#{@user.token}/finish_set_up?#{params.to_query}"
  end

end
