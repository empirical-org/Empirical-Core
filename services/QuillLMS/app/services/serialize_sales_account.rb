class SerializeSalesAccount

  def initialize(school_id)
    @school_id = school_id
  end

  def data
    {
      account_uid: school.id.to_s,
      method: 'account',
      params: {
        name: school.name,
        city: school.city,
        state: school.state,
        zipcode: school.zipcode,
        district: school.leanm,
        phone: school.phone,
        charter: school.charter,
        frl: school.free_lunches,
        ppin: school.ppin,
        nces_id: school.nces_id,
        school_subscription: school_subscription,
        school_type: school.ulocal_to_school_type,
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

  private

  def activities_per_student
    if active_students > 0
      (activities_finished.to_f / active_students).round(2)
    else
      0
    end
  end

  def active_students
    @active_students ||= ClassroomsTeacher
      .joins(user: :school, classroom: :activity_sessions)
        .where('schools.id = ?', @school_id)
        .where('activity_sessions.state = ?', 'finished')
        .group('activity_sessions.user_id')
        .count
        .length
  end

  def activities_finished
    @activities_finished ||= ClassroomsTeacher
      .joins(user: :school, classroom: :activity_sessions)
        .where('schools.id = ?', @school_id)
        .where('activity_sessions.state = ?', 'finished')
        .count
  end

  def school_subscription
    if school.subscription
      school.subscription.account_type
    else
      'NA'
    end
  end

  def employee_count
    school.users.where(role: 'teacher').count || 0
  end

  def paid_teacher_subscriptions
    School.joins(users: :subscriptions)
      .where(id: @school_id)
      .where('subscriptions.account_type = ?', 'Teacher Paid')
      .count
  end

  def school
    @school ||= School.find(@school_id)
  end

  def school_link
    "https://www.quill.org/cms/schools/#{school.id}"
  end

  def subscription_expiration_date
    subscription = school&.present_and_future_subscriptions&.last
    subscription&.expiration || 'NA'
  end
end
