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
        active_students: active_students,
        activities_finished: activities_finished,
        activities_per_student: activities_per_student,
        school_link: school_link,
        premium_expiry_date: subscription_expiration_date,
      }
    }
  end

  private def activities_per_student
    if active_students > 0
      (activities_finished.to_f / active_students).round(2)
    else
      0
    end
  end

  private def active_students
    @active_students ||= ClassroomsTeacher
      .joins(user: :school, classroom: :activity_sessions)
        .where('schools.id = ?', @school.id)
        .where('activity_sessions.state = ?', 'finished')
        .count("DISTINCT('activity_sessions.user_id')")
  end

  private def activities_finished
    @activities_finished ||= ClassroomsTeacher
      .joins(user: :school, classroom: :activity_sessions)
        .where('schools.id = ?', @school.id)
        .where('activity_sessions.state = ?', 'finished')
        .count
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
end
