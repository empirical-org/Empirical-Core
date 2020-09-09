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
        total_students: total_students,
        total_students_this_year: total_students(true),
        active_students: active_students,
        active_students_this_year: active_students(true),
        completed_activities: number_of_completed_activities,
        completed_activities_this_year: number_of_completed_activities(true),
        completed_activities_per_student: activities_per_student,
        completed_activities_per_student_this_year: activities_per_student(true),
        frl: free_lunches,
        teacher_link: teacher_link,
        edit_teacher_link: edit_teacher_link,
        city: city,
        state: state,
        zipcode: zipcode,
        district: district,
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

  private def activities_per_student(this_year_only=false)
    if active_students(this_year_only) > 0
      (number_of_completed_activities(this_year_only).to_f / active_students(this_year_only)).round(2)
    else
      0
    end
  end

  private def total_students(this_year_only=false)
    if this_year_only
      classrooms = @user.classrooms_i_teach.select { |c| year_start <= c.created_at }
      classrooms.reduce(0) { |sum, c| sum + c.students.count}
    else
      @user.students.count
    end
  end

  private def active_students(this_year_only=false)
    @active_students = begin
      ActivitySession.select(:user_id).distinct
        .joins(classroom_unit: {classroom: [:teachers]})
        .where(state: 'finished')
        .where(updated_at(this_year_only))
        .where('classrooms_teachers.user_id = ?', @user.id)
        .count
    end
  end

  private def number_of_completed_activities(this_year_only=false)
    @number_of_completed_activities = begin
      ClassroomsTeacher.joins(classroom: :activity_sessions)
        .where(user: @user)
        .where('activity_sessions.state = ?', 'finished')
        .where(updated_at(this_year_only))
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

  private def zipcode
    @user.school.zipcode if @user.school.present?
  end

  private def district
    @user.school.leanm if @user.school.present?
  end

  private def year_start
    year = Time.now.year
    year -= 1 if Time.now.strftime("%m/%d") <= Date.parse("07-31").strftime("%m/%d")
    Date.parse("#{year}-08-01")
  end

  private def updated_at(this_year_only)
    "activity_sessions.updated_at >= '#{year_start}'" if this_year_only
  end
end
