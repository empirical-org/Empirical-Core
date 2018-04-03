class SerializeSalesContact
  def initialize(teacher_id)
    @teacher_id = teacher_id
  end

  def data
    {
      contact_uid: teacher.id.to_s,
      method: 'contact',
      params: {
        email: teacher.email,
        name: teacher.name,
        school: school,
        account_uid: account_uid.to_s,
        signed_up: teacher.created_at.to_i,
        admin: teacher.admin?,
        premium_status: premium_status,
        premium_expiry_date: premium_expiration_date,
        number_of_students: number_of_students,
        number_of_completed_activities: number_of_completed_activities,
        number_of_completed_activities_per_student: activities_per_student,
        frl: free_lunches,
        teacher_link: teacher_link,
        city: city,
        state: state,
      }.merge(account_data_params)
    }
  end

  def account_data
    unless account_uid.blank? || account_data_params.blank?
      {
        account_uid: account_uid.to_s,
        method: 'account',
        params: account_data_params
      }
    end
  end

  private

  def account_data_params
    @account_data_params ||= Hash.new.tap do |hash|
      if teacher.sales_contact.present?
        teacher.sales_contact.stages.each do |stage|
          unless stage.completed_at.nil?
            hash[stage.name_param.to_sym] = stage.completed_at
          end
        end
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
      ClassroomsTeacher.joins(classroom: :activity_sessions)
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

  def school
    teacher.school.name if teacher.school.present?
  end

  def city
    teacher.school.city if teacher.school.present?
  end

  def state
    teacher.school.state if teacher.school.present?
  end

  def teacher
    @teacher ||= User.find(@teacher_id)
  end
end
