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
        city: school.mail_city,
        state: school.mail_state,
        zipcode: school.mail_zipcode,
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
        buying_stage: 'green field',
        activities_finished: activities_finished,
        school_link: school_link,
      }
    }
  end

  private

  def active_students
    User.joins(:school, :activity_sessions)
      .where(role: 'student')
      .where('schools.id = ?', @school_id)
      .where('activity_sessions.state = ?', 'finished')
      .distinct
      .count
  end

  def activities_finished
    School.joins(users: :activity_sessions)
      .where(id: @school_id)
      .where('users.role = ?', 'student')
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
end
