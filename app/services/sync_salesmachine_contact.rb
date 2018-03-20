class SyncSalesmachineContact
  def initialize(teacher_id, client = $smclient)
    @teacher_id = teacher_id
    @client = client
  end

  def sync
    @client.contact({ contact_uid: @teacher_id, params: params })
    if stages_params.present?
      @client.account({ account_uid: teacher.school.id, params: stages_params })
    end
  end

  def params
    {
      email: teacher.email,
      name: teacher.name,
      account_uid: account_uid,
      signed_up: teacher.created_at.to_i,
      admin: teacher.admin?,
      premium_status: premium_status,
      premium_expiry_date: premium_expiration_date,
      number_of_students: number_of_students,
      number_of_completed_activities: number_of_completed_activities,
      number_of_completed_activities_per_student: activities_per_student,
      frl: free_lunches,
      teacher_link: teacher_link,
    }.merge(stages_params)
  end

  private

  def stages_params
    if teacher.sales_contact.present?
      serialize_stages
    else
      {}
    end
  end

  def serialize_stages
    Hash.new.tap do |hash|
      teacher.sales_contact.stages.each do |stage|
        hash[stage.name.parameterize.underscore.to_sym] = stage.completed_at
      end
    end
  end

  def teacher_link
    "https://www.quill.org/cms/users/#{teacher.id}/sign_in"
  end

  def free_lunches
    if teacher.school.present?
      teacher.school.free_lunches
    else
      0
    end
  end

  def activities_per_student
    if number_of_students > 0
      number_of_completed_activities.to_f /
      number_of_students.to_f
    else
      0
    end
  end

  def number_of_students
    teacher.students.count
  end

  def number_of_completed_activities
    @number_of_completed_activities ||= begin
      Unit.joins(classroom_activities: :activity_sessions)
        .where(user_id: @teacher_id)
        .where('activity_sessions.state = ?', 'finished')
        .count
    end
  end

  def premium_status
    if subscription.present?
      subscription.account_type
    else
      'NA'
    end
  end

  def premium_expiration_date
    if subscription.present?
      subscription.expiration
    else
      'NA'
    end
  end

  def subscription
    teacher.subscription if teacher.subscription.present?
  end

  def account_uid
    teacher.school.id if teacher.school.present?
  end

  def teacher
    @teacher ||= User.find(@teacher_id)
  end
end
