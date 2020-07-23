class SerializeVitallySalesUser
  BASE_USER_URL = "https://www.quill.org/cms/users"

  def initialize(user)
    @user = user
  end

  def data
    {
      accountId: @user.school.id.to_s,
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
        number_of_students: number_of_students,
        number_of_completed_activities: number_of_completed_activities,
        number_of_completed_activities_per_student: activities_per_student,
        frl: free_lunches,
        teacher_link: teacher_link,
        edit_teacher_link: edit_teacher_link,
        city: city,
        state: state,
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

  private def activities_per_student
    if number_of_students > 0
      (number_of_completed_activities.to_f / number_of_students).round(2)
    else
      0
    end
  end

  private def number_of_students
    @user.students.count
  end

  private def number_of_completed_activities
    @number_of_completed_activities ||= begin
      ClassroomsTeacher.joins(classroom: :activity_sessions)
        .where(user: @user)
        .where('activity_sessions.state = ?', 'finished')
        .count
    end
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
    @user.subscription
  end

  private def account_uid
    @user.school.id
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
end
