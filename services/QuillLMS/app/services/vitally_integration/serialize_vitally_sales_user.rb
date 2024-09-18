# frozen_string_literal: true

module VitallyIntegration
  class SerializeVitallySalesUser
    include VitallyTeacherStats
    include VitallySharedFunctions

    BASE_USER_URL = 'https://www.quill.org/cms/users'

    def initialize(user)
      @user = user
      @vitally_entity = user

      current_time = Time.current
      @school_year_start = School.school_year_start(current_time)
      @school_year_end = school_year_start + 1.year
    end

    # rubocop:disable Metrics/CyclomaticComplexity
    # rubocop:disable Metrics/AbcSize
    def data
      current_time = Time.current
      school_year_start = School.school_year_start(current_time)
      school_year_end = school_year_start + 1.year
      active_students = active_students_query.count
      active_students_this_year = active_students_query.where('activity_sessions.completed_at >= ?', school_year_start).count
      activities_finished = activities_finished_query.count
      activities_finished_this_year = activities_finished_query.where('activity_sessions.completed_at >= ?', school_year_start).count
      activities_assigned = activities_assigned_count
      activities_assigned_this_year = activities_assigned_in_year_count
      evidence_activities_assigned_all_time = evidence_assigned_count
      evidence_activities_assigned_this_year = evidence_assigned_in_year_count
      evidence_activities_completed_all_time = evidence_finished.count
      evidence_activities_completed_this_year = evidence_completed_in_year_count
      date_of_last_completed_evidence_activity = evidence_finished.order('activity_sessions.completed_at DESC').select('activity_sessions.completed_at').first&.completed_at&.strftime('%F') || 'N/A'
      learn_worlds_account = @user.learn_worlds_account
      learn_worlds_enrolled_courses = learn_worlds_account&.enrolled_courses
      learn_worlds_completed_courses = learn_worlds_account&.completed_courses
      learn_worlds_earned_certificate_courses = learn_worlds_account&.earned_certificate_courses

      {
        accountId: @user.school&.id&.to_s,
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
          flags: @user.flags.to_s,
          flagset: @user.flagset,
          school_point_of_contact: @user.school_poc?,
          premium_status: premium_status,
          premium_expiry_date: subscription_expiration_date,
          frl: free_lunches,
          teacher_link: teacher_link,
          edit_teacher_link: edit_teacher_link,
          city: city,
          state: state,
          zipcode: zipcode,
          district: district,
          ip_city: @user.ip_location&.city,
          ip_state: @user.ip_location&.state,
          total_students: @user.students.count,
          active_students: active_students,
          activities_assigned: activities_assigned,
          completed_activities: activities_finished,
          percent_completed_activities: activities_assigned > 0 ? (activities_finished.to_f / activities_assigned).round(2) : 'N/A',
          completed_activities_per_student: activities_per_student(active_students, activities_finished),
          total_students_this_year: total_students_in_year,
          total_students_last_year: get_from_cache('total_students'),
          active_students_this_year: active_students_this_year,
          active_students_last_year: get_from_cache('active_students'),
          activities_assigned_this_year: activities_assigned_this_year,
          activities_assigned_last_year: get_from_cache('activities_assigned'),
          completed_activities_this_year: activities_finished_this_year,
          completed_activities_last_year: get_from_cache('completed_activities'),
          completed_activities_per_student_this_year: activities_per_student(active_students_this_year, activities_finished_this_year),
          completed_activities_per_student_last_year: get_from_cache('completed_activities_per_student'),
          percent_completed_activities_this_year: activities_assigned_this_year > 0 ? (activities_finished_this_year.to_f / activities_assigned_this_year).round(2) : 'N/A',
          percent_completed_activities_last_year: get_from_cache('percent_completed_activities'),
          **diagnostic_rollups,
          evidence_activities_assigned_all_time:,
          evidence_activities_assigned_this_year:,
          evidence_activities_assigned_last_year: get_from_cache('evidence_activities_assigned'),
          evidence_activities_completed_all_time:,
          evidence_activities_completed_this_year:,
          evidence_activities_completed_last_year: get_from_cache('evidence_activities_completed'),
          completed_evidence_activities_per_student_this_year: activities_per_student(active_students_this_year, evidence_activities_completed_this_year),
          completed_evidence_activities_per_student_last_year: get_from_cache('completed_evidence_activities_per_student'),
          date_of_last_completed_evidence_activity:,
          premium_state: @user.premium_state,
          premium_type: @user.subscription&.account_type,
          role: @user.role,
          admin_sub_role: @user.admin_sub_role,
          email_verification_status: @user.email_verification_status,
          admin_approval_status: @user.admin_approval_status,
          number_of_schools_administered: number_of_schools_administered,
          number_of_districts_administered: number_of_districts_administered,
          learn_worlds_num_enrolled_courses: learn_worlds_enrolled_courses&.count,
          learn_worlds_enrolled_courses: learn_worlds_enrolled_courses&.titles_string,
          learn_worlds_num_completed_courses: learn_worlds_completed_courses&.count,
          learn_worlds_completed_courses: learn_worlds_completed_courses&.titles_string,
          learn_worlds_num_earned_certificate_courses: learn_worlds_earned_certificate_courses&.count,
          learn_worlds_earned_certificate_courses: learn_worlds_earned_certificate_courses&.titles_string,
          learn_worlds_last_login: learn_worlds_account&.last_login&.to_date
        }.merge(account_data_params)
      }
    end
    # rubocop:enable Metrics/CyclomaticComplexity
    # rubocop:enable Metrics/AbcSize

    def account_data
      return if account_uid.blank? || account_data_params.blank?

      {
        accountId: account_uid.to_s,
        type: 'account',
        traits: account_data_params
      }
    end

    private def diagnostic_rollups
      diagnostics_assigned = diagnostics_assigned_count
      diagnostics_assigned_this_year = diagnostics_assigned_in_year_count
      diagnostics_finished_this_year = diagnostics_finished.where('activity_sessions.completed_at >=?', school_year_start).count

      {
        diagnostics_assigned: diagnostics_assigned,
        diagnostics_finished: diagnostics_finished.count,
        percent_completed_diagnostics: diagnostics_assigned > 0 ? (diagnostics_finished.count.to_f / diagnostics_assigned).round(2) : 'N/A',
        diagnostics_assigned_this_year: diagnostics_assigned_this_year,
        diagnostics_assigned_last_year: get_from_cache('diagnostics_assigned'),
        diagnostics_finished_this_year: diagnostics_finished_this_year,
        diagnostics_finished_last_year: get_from_cache('diagnostics_finished'),
        percent_completed_diagnostics_this_year: diagnostics_assigned_this_year > 0 ? (diagnostics_finished_this_year.to_f / diagnostics_assigned_this_year).round(2) : 'N/A',
        percent_completed_diagnostics_last_year: get_from_cache('percent_completed_diagnostics'),
        pre_diagnostics_assigned_this_year: live_pre_diagnostics_assigned_in_year_count,
        pre_diagnostics_completed_this_year: live_pre_diagnostics_completed_in_year_count,
        pre_diagnostics_assigned_last_year: get_from_cache('pre_diagnostics_assigned'),
        pre_diagnostics_completed_last_year: get_from_cache('pre_diagnostics_completed'),
        pre_diagnostics_assigned_all_time: pre_diagnostics_assigned_count,
        pre_diagnostics_completed_all_time: pre_diagnostics_completed.count,
        post_diagnostics_assigned_this_year: live_post_diagnostics_assigned_in_year_count,
        post_diagnostics_completed_this_year: live_post_diagnostics_completed_in_year_count,
        post_diagnostics_assigned_last_year: get_from_cache('post_diagnostics_assigned'),
        post_diagnostics_completed_last_year: get_from_cache('post_diagnostics_completed'),
        post_diagnostics_assigned_all_time: post_diagnostics_assigned_count,
        post_diagnostics_completed_all_time: post_diagnostics_completed.count
      }
    end

    private def get_from_cache(key)
      last_school_year = School.school_year_start(Date.current - 1.year).year
      cached_data = CacheVitallyTeacherData.get(@user.id, last_school_year)
      if cached_data.present?
        parsed_data = JSON.parse(cached_data)
      else
        parsed_data = PreviousYearTeacherDatum.new(@user, last_school_year).calculate_data || {}
        CacheVitallyTeacherData.set(@user.id, last_school_year, parsed_data.to_json)
      end
      parsed_data[key]
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

    private def activities_assigned_count
      sum_students(activities_assigned_query)
    end

    private def diagnostics_assigned_count
      sum_students(filter_diagnostics(activities_assigned_query))
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
      @user.present_and_future_subscriptions.last
    end

    private def account_uid
      @user.school&.id
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
      @user.school.district&.name if @user.school.present?
    end

    private def number_of_schools_administered
      @user.schools_admins.count || nil
    end

    private def number_of_districts_administered
      @user.district_admins.count || nil
    end
  end
end
