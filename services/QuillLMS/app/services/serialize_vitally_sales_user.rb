class SerializeVitallySalesUser
  BASE_USER_URL = "https://www.quill.org/cms/users"
  # DIAGNOSTIC_ID = ActivityClassification.find_by_key('diagnostic').id

  def initialize(user)
    @user = user
  end

  def data
    current_time = Time.zone.now
    school_year_start = School.school_year_start(current_time)
    active_students = active_students_query(@user).count
    active_students_this_year = active_students_query(@user).where("activity_sessions.completed_at >= ?", school_year_start).count
    activities_finished = activities_finished_query(@user).count
    activities_finished_this_year = activities_finished_query(@user).where("activity_sessions.completed_at >= ?", school_year_start).count
    activities_assigned = activities_assigned_count(@user)
    activities_assigned_this_year = activities_assigned_this_year_count(@user, school_year_start)
    diagnostics_assigned = diagnostics_assigned_count(@user)
    diagnostics_assigned_this_year = diagnostics_assigned_this_year_count(@user, school_year_start)
    diagnostics_finished = diagnostics_finished(@user).count
    diagnostics_finished_this_year = diagnostics_finished(@user).where("activity_sessions.completed_at >=?", school_year_start).count
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
        total_students_this_year: total_students_this_year(school_year_start),
        active_students_this_year: active_students_this_year,
        activities_assigned_this_year: activities_assigned_this_year,
        completed_activities_this_year: activities_finished_this_year,
        completed_activities_per_student_this_year: activities_per_student(active_students_this_year, activities_finished_this_year),
        percent_completed_activities_this_year: activities_assigned_this_year > 0 ? (activities_finished_this_year.to_f / activities_assigned_this_year).round(2) : 'N/A',
        diagnostics_assigned_this_year: diagnostics_assigned_this_year,
        diagnostics_finished_this_year: diagnostics_finished_this_year,
        percent_completed_diagnostics_this_year: diagnostics_assigned_this_year > 0 ? (diagnostics_finished_this_year.to_f / diagnostics_assigned_this_year).round(2) : 'N/A'
      }.merge(account_data_params)
    }
  end

  def account_data
    unless account_uid.blank? || account_data_params.blank?
      {
        accountId: account_uid.to_s,
        type: 'account',
        traits: account_data_params
      }
    end
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

  private def activities_per_student(active_students, activities_finished)
    if active_students > 0
      (activities_finished.to_f / active_students).round(2)
    else
      0
    end
  end

  private def total_students_this_year(school_year_start)
    classrooms = @user.classrooms_i_teach.select { |c| school_year_start <= c.created_at }
    classrooms.sum { |c| c.students.count}
  end

  private def active_students_query(user)
    @active_students ||= ActivitySession.select(:user_id).distinct
      .joins(classroom_unit: {classroom: [:teachers]})
      .where(state: 'finished')
      .where('classrooms_teachers.user_id = ?', user.id)
  end

  private def activities_assigned_query(user)
    @activities_assigned ||= user.assigned_students_per_activity_assigned
  end

  private def activities_assigned_count(user)
    sum_students(activities_assigned_query(user))
  end

  private def diagnostics_assigned_count(user)
    sum_students(filter_diagnostics(activities_assigned_query(user)))
  end

  private def diagnostics_assigned_this_year_count(user, school_year_start)
    sum_students(filter_diagnostics(this_school_year(activities_assigned_query(user), school_year_start)))
  end

  private def activities_assigned_this_year_count(user, school_year_start)
    sum_students(this_school_year(activities_assigned_query(user), school_year_start))
  end

  private def sum_students(records)
    records.map { |r| r.assigned_student_ids.count }.sum || 0
  end

  private def this_school_year(records, school_year_start)
    records.select {|r| r.created_at >= school_year_start }
  end

  private def filter_diagnostics(records)
    records.select {|r| Activity.find(r.id).is_diagnostic? }
  end

  private def diagnostics_finished(user)
    activities_finished_query(user).where("activities.activity_classification_id=4")
  end

  private def activities_finished_query(user)
    @activities_finished ||= ClassroomsTeacher
      .where(user_id: user.id)
      .joins(classroom: [classroom_units: [activity_sessions: :activity]])
      .where("activity_sessions.state='finished'")
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
    @user.school.leanm if @user.school.present?
  end

end
