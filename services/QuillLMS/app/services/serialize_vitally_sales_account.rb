class SerializeVitallySalesAccount

  def initialize(school)
    @school = school
  end

  def data
    current_time = Time.zone.now
    active_students = active_students_query(@school).count
    active_students_this_year = active_students_query(@school).where("activity_sessions.updated_at > ?", School.school_year_start(current_time)).count
    activities_finished = activities_finished_query(@school).count
    activities_finished_this_year = activities_finished_query(@school).where("activity_sessions.updated_at > ?", School.school_year_start(current_time)).count
    {
      accountId: @school.id.to_s,
      # Type is used by Vitally to determine which data type the payload contains in batches
      type: 'account',
      # Vitally requires a unique messageId for dedupication purposes
      messageId: SecureRandom.uuid,
      traits: {
        name: @school.name,
        address: @school.street,
        city: @school.city,
        state: @school.state,
        zipcode: @school.zipcode,
        district: @school.leanm,
        phone: @school.phone,
        charter: @school.charter,
        frl: @school.free_lunches,
        ppin: @school.ppin,
        nces_id: @school.nces_id,
        school_subscription: school_subscription,
        school_type: @school.ulocal_to_school_type,
        employee_count: employee_count,
        paid_teacher_subscriptions: paid_teacher_subscriptions,
        total_students: total_students,
        total_students_this_year: total_students(true, current_time),
        active_students: active_students,
        active_students_this_year: active_students_this_year,
        activities_finished: activities_finished,
        activities_finished_this_year: activities_finished_this_year,
        activities_per_student: activities_per_student(active_students, activities_finished),
        activities_per_student_this_year: activities_per_student(active_students_this_year, activities_finished_this_year),
        school_link: school_link,
        created_at: @school.created_at,
        premium_expiry_date: subscription_expiration_date,
        last_active: last_active
      }
    }
  end

  private def activities_per_student(active_students, activities_finished)
    if active_students > 0
      (activities_finished.to_f / active_students).round(2)
    else
      0
    end
  end

  private def total_students(this_year_only=false, current_time=nil)
    if this_year_only
      @school.students.where(last_sign_in: School.school_year_start(current_time)..current_time).count
    else
      @school.students.count
    end
  end

  private def active_students_query(school)
    ActivitySession.select(:user_id).distinct
          .joins(classroom_unit: {classroom: {teachers: :school}})
          .where(state: 'finished')
          .where('schools.id = ?', school.id)
  end

  private def activities_finished_query(school)
    ClassroomsTeacher.joins(user: :school, classroom: :activity_sessions)
      .where('schools.id = ?', @school.id)
      .where('activity_sessions.state = ?', 'finished')
  end

  private def school_subscription
    if @school.subscription
      @school.subscription.account_type
    else
      'NA'
    end
  end

  private def employee_count
    @school.users.where(role: 'teacher').count || 0
  end

  private def paid_teacher_subscriptions
    School.joins(users: :subscriptions)
      .where(id: @school.id)
      .where('subscriptions.account_type = ?', 'Teacher Paid')
      .count
  end

  private def school_link
    "https://www.quill.org/cms/schools/#{@school.id}"
  end

  private def subscription_expiration_date
    @school&.subscription&.expiration || 'NA'
  end

  private def last_active
    School.joins(users: {classrooms_i_teach: :activity_sessions})
          .where(id: @school.id)
          .maximum('activity_sessions.completed_at')
  end
end
