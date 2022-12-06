# frozen_string_literal: true

class SerializeVitallySalesAccount
  include VitallySchoolStats

  def initialize(school)
    @school = school
  end

  def data
    current_time = Time.current
    school_year_start = School.school_year_start(current_time)
    active_students = active_students_query(@school).count
    active_students_this_year = active_students_query(@school).where("activity_sessions.updated_at >= ?", school_year_start).count
    activities_finished = activities_finished_query(@school).count("DISTINCT activity_sessions.id")
    activities_finished_this_year = activities_finished_query(@school).where("activity_sessions.updated_at >= ?", school_year_start).count("DISTINCT activity_sessions.id")
    {
      accountId: @school.id.to_s,
      organizationId: organization_id,
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
        district: @school.district&.name,
        phone: @school.phone,
        charter: @school.charter,
        frl: @school.free_lunches,
        ppin: @school.ppin,
        nces_id: @school.nces_id,
        school_subscription: school_subscription,
        school_type: @school.ulocal_to_school_type,
        employee_count: employee_count,
        paid_teacher_subscriptions: paid_teacher_subscriptions,
        total_students: @school.students.count,
        total_students_this_year: @school.students.where(last_sign_in: school_year_start..current_time).count,
        total_students_last_year: get_from_cache("total_students"),
        active_students: active_students,
        active_students_this_year: active_students_this_year,
        active_students_last_year: get_from_cache("active_students"),
        activities_finished: activities_finished,
        activities_finished_this_year: activities_finished_this_year,
        activities_finished_last_year: get_from_cache("activities_finished"),
        activities_per_student: activities_per_student(active_students, activities_finished),
        activities_per_student_this_year: activities_per_student(active_students_this_year, activities_finished_this_year),
        activities_per_student_last_year: get_from_cache("activities_per_student"),
        school_link: school_link,
        created_at: @school.created_at,
        premium_expiry_date: subscription_expiration_date,
        last_active: last_active
      }
    }
  end

  private def get_from_cache(key)
    last_school_year = School.school_year_start(Date.current - 1.year).year
    cached_data = CacheVitallySchoolData.get(@school.id, last_school_year)
    if cached_data.present?
      parsed_data = JSON.parse(cached_data)
    else
      parsed_data = PreviousYearSchoolDatum.new(@school, last_school_year).calculate_data || {}
      CacheVitallySchoolData.set(@school.id, last_school_year, parsed_data.to_json)
    end
    parsed_data[key]
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
    subscription = @school&.present_and_future_subscriptions&.last
    subscription&.expiration || 'NA'
  end

  private def last_active
    School.joins(users: {classrooms_i_teach: :activity_sessions})
          .where(id: @school.id)
          .maximum('activity_sessions.completed_at')
  end

  private def organization_id
    return @school.district.id.to_s if @school.district&.schools&.any?(&:subscription)

    ""
  end
end
