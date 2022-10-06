# frozen_string_literal: true

class SerializeVitallySalesUser
  include VitallyTeacherStats

  BASE_USER_URL = "https://www.quill.org/cms/users"

  def initialize(user)
    @user = user
  end

  # rubocop:disable Metrics/CyclomaticComplexity
  # rubocop:disable Metrics/AbcSize
  def data
    current_time = Time.current
    school_year_start = School.school_year_start(current_time)
    school_year_end = school_year_start + 1.year
    active_students = active_students_query(@user).count
    active_students_this_year = active_students_query(@user).where("activity_sessions.completed_at >= ?", school_year_start).count
    activities_finished = activities_finished_query(@user).count
    activities_finished_this_year = activities_finished_query(@user).where("activity_sessions.completed_at >= ?", school_year_start).count
    activities_assigned = activities_assigned_count(@user)
    activities_assigned_this_year = activities_assigned_in_year_count(@user, school_year_start, school_year_end)
    diagnostics_assigned = diagnostics_assigned_count(@user)
    diagnostics_assigned_this_year = diagnostics_assigned_in_year_count(@user, school_year_start, school_year_end)
    diagnostics_finished = diagnostics_finished(@user).count
    diagnostics_finished_this_year = diagnostics_finished(@user).where("activity_sessions.completed_at >=?", school_year_start).count
    evidence_activities_assigned_this_year = evidence_assigned_in_year_count(@user, school_year_start, school_year_end)
    evidence_activities_completed_this_year = evidence_completed_in_year_count(@user, school_year_start, school_year_end)
    date_of_last_completed_evidence_activity = evidence_finished(@user).order("activity_sessions.completed_at DESC").select("activity_sessions.completed_at").first&.completed_at&.strftime("%F") || 'N/A'
    {
      accountId: @user.school&.id&.to_s,
      userId: @user.id.to_s,
      # Type is used by Vitally to determine which data type the payload contains in batches
      type: 'user',
      # Vitally requires a unique messageId for dedupication purposes
      messageId: SecureRandom.uuid,
      traits: {
        email: @user.email,
        name: @user.name,
        title: @user.title,
        school: school,
        account_uid: account_uid.to_s,
        signed_up: @user.created_at.to_i,
        admin: @user.admin?,
        auditor: @user.auditor?,
        purchaser: @user.purchaser?,
        flags: @user.flags.to_s,
        flagset: @user.flagset,
        school_point_of_contact: @user.school_poc?,
        premium_status: premium_status,
        premium_expiry_date: subscription_expiration_date,
        frl: free_lunches,
        teacher_link: teacher_link,
        edit_teacher_link: edit_teacher_link,
        city: city,
        state: state,
        zipcode: zipcode,
        district: district,
        total_students: @user.students.count,
        active_students: active_students,
        activities_assigned: activities_assigned,
        completed_activities: activities_finished,
        percent_completed_activities: activities_assigned > 0 ? (activities_finished.to_f / activities_assigned).round(2) : 'N/A',
        completed_activities_per_student: activities_per_student(active_students, activities_finished),
        diagnostics_assigned: diagnostics_assigned,
        diagnostics_finished: diagnostics_finished,
        percent_completed_diagnostics: diagnostics_assigned > 0 ? (diagnostics_finished.to_f / diagnostics_assigned).round(2) : 'N/A',
        total_students_this_year: total_students_in_year(@user, school_year_start, school_year_end),
        total_students_last_year: get_from_cache("total_students"),
        active_students_this_year: active_students_this_year,
        active_students_last_year: get_from_cache("active_students"),
        activities_assigned_this_year: activities_assigned_this_year,
        activities_assigned_last_year: get_from_cache("activities_assigned"),
        completed_activities_this_year: activities_finished_this_year,
        completed_activities_last_year: get_from_cache("completed_activities"),
        completed_activities_per_student_this_year: activities_per_student(active_students_this_year, activities_finished_this_year),
        completed_activities_per_student_last_year: get_from_cache("completed_activities_per_student"),
        percent_completed_activities_this_year: activities_assigned_this_year > 0 ? (activities_finished_this_year.to_f / activities_assigned_this_year).round(2) : 'N/A',
        percent_completed_activities_last_year: get_from_cache("percent_completed_activities"),
        diagnostics_assigned_this_year: diagnostics_assigned_this_year,
        diagnostics_assigned_last_year: get_from_cache("diagnostics_assigned"),
        diagnostics_finished_this_year: diagnostics_finished_this_year,
        diagnostics_finished_last_year: get_from_cache("diagnostics_finished"),
        percent_completed_diagnostics_this_year: diagnostics_assigned_this_year > 0 ? (diagnostics_finished_this_year.to_f / diagnostics_assigned_this_year).round(2) : 'N/A',
        percent_completed_diagnostics_last_year: get_from_cache("percent_completed_diagnostics"),
        evidence_activities_assigned_this_year: evidence_activities_assigned_this_year,
        evidence_activities_completed_this_year: evidence_activities_completed_this_year,
        evidence_activities_assigned_last_year: get_from_cache('evidence_activities_assigned'),
        evidence_activities_completed_last_year: get_from_cache('evidence_activities_completed'),
        completed_evidence_activities_per_student_this_year: activities_per_student(active_students_this_year, evidence_activities_completed_this_year),
        completed_evidence_activities_per_student_last_year: get_from_cache("completed_evidence_activities_per_student"),
        date_of_last_completed_evidence_activity: date_of_last_completed_evidence_activity,
        premium_state: @user.premium_state,
        premium_type: @user.subscription&.account_type
      }.merge(account_data_params)
    }
  end
  # rubocop:enable Metrics/CyclomaticComplexity
  # rubocop:enable Metrics/AbcSize

  def account_data
    return if account_uid.blank? || account_data_params.blank?

    {
      accountId: account_uid.to_s,
      type: 'account',
      traits: account_data_params
    }
  end

  private def get_from_cache(key)
    last_school_year = School.school_year_start(Date.current - 1.year).year
    cached_data = CacheVitallyTeacherData.get(@user.id, last_school_year)
    if cached_data.present?
      parsed_data = JSON.parse(cached_data)
    else
      parsed_data = PreviousYearTeacherDatum.new(@user, last_school_year).calculate_data || {}
      CacheVitallyTeacherData.set(@user.id, last_school_year, parsed_data.to_json)
    end
    parsed_data[key]
  end

  private def account_data_params
    @account_data_params ||= {}.tap do |hash|
      if @user.sales_contact.present?
        @user.sales_contact.stages.each do |stage|
          unless stage.completed_at.nil?
            hash[stage.name_param.to_sym] = stage.completed_at
          end
        end
      end
    end
  end

  private def teacher_link
    "#{BASE_USER_URL}/#{@user.id}/sign_in"
  end

  private def edit_teacher_link
    "#{BASE_USER_URL}/#{@user.id}/edit"
  end

  private def free_lunches
    if @user.school.present?
      @user.school.free_lunches
    else
      0
    end
  end

  private def activities_assigned_count(user)
    sum_students(activities_assigned_query(user))
  end

  private def diagnostics_assigned_count(user)
    sum_students(filter_diagnostics(activities_assigned_query(user)))
  end

  private def premium_status
    if subscription.present?
      subscription.account_type
    else
      'NA'
    end
  end

  private def subscription_expiration_date
    if subscription.present?
      subscription.expiration
    elsif @user.last_expired_subscription.present?
      @user.last_expired_subscription.expiration
    else
      'NA'
    end
  end

  private def subscription
    @user.present_and_future_subscriptions.last
  end

  private def account_uid
    @user.school&.id
  end

  private def school
    @user.school&.name
  end

  private def city
    @user.school&.city
  end

  private def state
    @user.school.state if @user.school.present?
  end

  private def zipcode
    @user.school.zipcode if @user.school.present?
  end

  private def district
    @user.school.district&.name if @user.school.present?
  end

end
