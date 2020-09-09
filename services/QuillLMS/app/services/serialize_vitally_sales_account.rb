class SerializeVitallySalesAccount

  def initialize(school)
    @school = school
  end

  def data
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
        total_students_this_year: total_students(true),
        active_students: active_students,
        active_students_this_year: active_students(true),
        activities_finished: activities_finished,
        activities_finished_this_year: activities_finished(true),
        activities_per_student: activities_per_student,
        activities_per_student_this_year: activities_per_student(true),
        school_link: school_link,
        created_at: @school.created_at,
        premium_expiry_date: subscription_expiration_date,
        last_active: last_active
      }
    }
  end

  private def activities_per_student(this_year_only=false)
    if active_students(this_year_only) > 0
      (activities_finished(this_year_only).to_f / active_students(this_year_only)).round(2)
    else
      0
    end
  end

  private def total_students(this_year_only=false)
    if this_year_only
      @school.students.where(last_sign_in: year_start..Date.today).count
    else
      @school.students.count
    end
  end

  private def active_students(this_year_only=false)
    @active_students = begin
      ActivitySession.select(:user_id).distinct
        .joins(classroom_unit: {classroom: {teachers: :school}})
        .where(state: 'finished')
        .where(updated_at(this_year_only))
        .where('schools.id = ?', @school.id)
        .count
    end
  end

  private def activities_finished(this_year_only=false)
    @activities_finished = begin
      ClassroomsTeacher.joins(user: :school, classroom: :activity_sessions)
        .where('schools.id = ?', @school.id)
        .where('activity_sessions.state = ?', 'finished')
        .where(updated_at(this_year_only))
        .count
    end
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

  private def year_start
    year = Time.now.year
    year -= 1 if Time.now.strftime("%m/%d") < Date.parse("07-31").strftime("%m/%d")
    Date.parse("#{year}-08-01")
  end

  private def updated_at(this_year_only)
    "activity_sessions.updated_at >= '#{year_start}'" if this_year_only
  end
end
