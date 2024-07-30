# frozen_string_literal: true

module VitallyIntegration
  class SerializeVitallySalesOrganization
    include VitallySharedFunctions

    attr_accessor :district

    VITALLY_NOT_APPLICABLE = 'N/A'

    def initialize(district)
      @district = district
      @vitally_entity = district

      current_time = Time.current
      @school_year_start = School.school_year_start(current_time)
      @school_year_end = school_year_start + 1.year
    end

    def data
      {
        externalId: district.id.to_s,
        name: district.name,
        traits: {
          name: district.name,
          nces_id: district.nces_id,
          clever_id: district.clever_id,
          city: district.city,
          state: district.state,
          zipcode: district.zipcode,
          phone: district.phone,
          total_students: district.total_students,
          total_schools: district.total_schools,
          **diagnostic_rollups,
          **evidence_rollups,
          **subscription_rollups,
          **activities_and_students_rollups
        }
      }
    end

    def activities_and_students_rollups
      last_school_year_start = school_year_start - 1.year

      active_students_this_year = active_students(school_year_start)
      active_students_last_year = active_students(last_school_year_start, school_year_start)
      active_students_all_time = active_students
      activities_completed_this_year = activities_completed(school_year_start)
      activities_completed_last_year = activities_completed(last_school_year_start, school_year_start)
      activities_completed_all_time = activities_completed

      {
        active_students_this_year: active_students_this_year,
        active_students_last_year: active_students_last_year,
        active_students_all_time: active_students_all_time,
        activities_completed_this_year: activities_completed_this_year,
        activities_completed_last_year: activities_completed_last_year,
        activities_completed_all_time: activities_completed_all_time,
        activities_completed_per_student_this_year: active_students_this_year > 0 ? ((activities_completed_this_year.to_f / active_students_this_year).round(2)) : 0,
        activities_completed_per_student_last_year: active_students_last_year > 0 ? ((activities_completed_last_year.to_f / active_students_last_year).round(2)) : 0,
        activities_completed_per_student_all_time: active_students_all_time > 0 ? ((activities_completed_all_time.to_f / active_students_all_time).round(2)) : 0,
        last_active_time: last_active_time,
      }
    end

    def diagnostic_rollups
      diagnostics_assigned_this_year = diagnostics_assigned_between_count(school_year_start, school_year_start + 1.year)
      diagnostics_assigned_last_year = diagnostics_assigned_between_count(school_year_start - 1.year, school_year_start)
      diagnostics_completed_this_year = diagnostics_completed_between(school_year_start, school_year_start + 1.year)
      diagnostics_completed_last_year = diagnostics_completed_between(school_year_start - 1.year, school_year_start)
      percent_completed_this_year = diagnostics_assigned_this_year > 0 ? (1.0 * diagnostics_completed_this_year / diagnostics_assigned_this_year) : 0.0
      percent_completed_last_year = diagnostics_assigned_last_year > 0 ? (1.0 * diagnostics_completed_last_year / diagnostics_assigned_last_year) : 0.0

      {
        diagnostics_assigned_this_year: diagnostics_assigned_this_year,
        diagnostics_assigned_last_year: diagnostics_assigned_last_year,
        diagnostics_completed_this_year: diagnostics_completed_this_year,
        diagnostics_completed_last_year: diagnostics_completed_last_year,
        percent_diagnostics_completed_this_year: percent_completed_this_year,
        percent_diagnostics_completed_last_year: percent_completed_last_year
      }
    end

    private def evidence_rollups
      last_school_year_start = school_year_start - 1.year

      active_students_this_year = active_students(school_year_start)
      active_students_last_year = active_students(last_school_year_start, school_year_start)

      evidence_activities_assigned_all_time = evidence_assigned_count
      evidence_activities_assigned_this_year = sum_students(filter_evidence(in_school_year(activities_assigned_query, school_year_start, school_year_end)))
      evidence_activities_assigned_last_year = sum_students(filter_evidence(in_school_year(activities_assigned_query, last_school_year_start, school_year_start)))
      evidence_activities_completed_all_time = evidence_finished.count
      evidence_activities_completed_this_year = evidence_finished.where('activity_sessions.completed_at >=? AND activity_sessions.completed_at < ?', school_year_start, school_year_end).count
      evidence_activities_completed_per_student_this_year = activities_per_student(active_students_this_year, evidence_activities_completed_this_year)
      evidence_activities_completed_last_year = evidence_finished.where('activity_sessions.completed_at >=? AND activity_sessions.completed_at < ?', last_school_year_start, school_year_start).count
      evidence_activities_completed_per_student_last_year = activities_per_student(active_students_last_year, evidence_activities_completed_last_year)

      {
        evidence_activities_assigned_all_time:,
        evidence_activities_assigned_this_year:,
        evidence_activities_assigned_last_year:,
        evidence_activities_completed_all_time:,
        evidence_activities_completed_this_year:,
        evidence_activities_completed_last_year:,
        evidence_activities_completed_per_student_this_year:,
        evidence_activities_completed_per_student_last_year:,
      }
    end

    def subscription_rollups
      {
        earliest_premium_start_date:,
        current_premium_start_date:,
        premium_expiry_date:,
        district_subscription:,
        annual_revenue_current_contract:,
        stripe_invoice_id_current_contract:,
        purchase_order_number_current_contract:,
        total_premium_months:,
      }
    end

    def diagnostics_assigned_between_count(start, stop)
      district.schools.select("array_length(classroom_units.assigned_student_ids, 1) AS assigned_students")
        .joins(users: {
        unscoped_classrooms_i_teach: {
          classroom_units: {
            unit_activities: {
            activity: :classification
            }
          }
        }
      }).where(classification: {key: ActivityClassification::DIAGNOSTIC_KEY})
        .where(classroom_units: {created_at: start..stop})
        .map(&:assigned_students).reject(&:blank?).sum
    end

    def diagnostics_completed_between(start, stop)
      district.schools.joins(users: {
        unscoped_classrooms_i_teach: {
          classroom_units: {
            activity_sessions: {
              activity: :classification
            }
          }
        }
      }).where(classification: { key: ActivityClassification::DIAGNOSTIC_KEY} )
        .where(activity_sessions: { completed_at: start..stop} )
        .count
    end

    def active_students(start_date=nil, end_date=nil)
      return activities_completed_all_time.group('students.id').length if start_date.blank? && end_date.blank?

      if start_date.present?
        filtered_results = activities_completed_all_time.where('activity_sessions.completed_at >= ?', start_date).group('students.id')
      end

      if end_date.present?
        filtered_results = activities_completed_all_time.where('activity_sessions.completed_at <= ?', end_date).group('students.id')
      end

      filtered_results.length
    end

    def activities_completed(start_date=nil, end_date=nil)
      return activities_completed_all_time.count if start_date.blank? && end_date.blank?

      if start_date.present?
        filtered_results = activities_completed_all_time.where('activity_sessions.completed_at >= ?', start_date)
      end

      if end_date.present?
        filtered_results = activities_completed_all_time.where('activity_sessions.completed_at <= ?', end_date)
      end

      filtered_results.count
    end

    def last_active_time
      User.select('students.last_sign_in')
        .includes(schools_users: [school: :district])
        .where('districts.id = ?', district.id).references(:district)
        .includes(classrooms_teachers: [classroom_unscoped: :students_classrooms])
        .joins('JOIN users students ON students.id = students_classrooms.student_id')
        .order('students.last_sign_in DESC')
        .first
        &.last_sign_in
    end

    def activities_completed_all_time
      @activities_completed ||= ClassroomsTeacher.select('students.id')
        .joins([user: [schools_users: [school: :district]]])
        .joins([classroom_unscoped: [classroom_units: :activity_sessions]])
        .joins("JOIN users students on students.id = activity_sessions.user_id")
        .where('districts.id = ?', district.id)
        .where('activity_sessions.state = ?', 'finished')
    end

    def activities_assigned_query
      ClassroomUnit.joins(classroom_unscoped: { teachers: { school: :district } }, unit: :activities)
        .where('districts.id = ?', district.id)
        .select('assigned_student_ids', 'activities.id', 'unit_activities.created_at')
    end

    def activities_finished_query
      ClassroomsTeacher.joins(user: { schools_users: { school: :district }}, classroom_unscoped: [{ classroom_units: { unit: :activities } }, { classroom_units: :activity_sessions }])
        .where('districts.id = ?', district.id)
        .where('activity_sessions.state = ?', 'finished')
    end

    private def first_subscription
      district.subscriptions.order(start_date: :asc).first
    end

    private def latest_subscription
      district.subscriptions.not_expired.not_de_activated.order(expiration: :desc).first
    end

    private def earliest_premium_start_date
      first_subscription&.start_date || VITALLY_NOT_APPLICABLE
    end

    private def current_premium_start_date
      district.subscription&.start_date || VITALLY_NOT_APPLICABLE
    end

    private def premium_expiry_date
      latest_subscription&.expiration || VITALLY_NOT_APPLICABLE
    end

    private def district_subscription
      district.subscription&.account_type || VITALLY_NOT_APPLICABLE
    end

    private def annual_revenue_current_contract
      district.subscription&.payment_amount || VITALLY_NOT_APPLICABLE
    end

    private def stripe_invoice_id_current_contract
      district.subscription&.stripe_invoice_id || VITALLY_NOT_APPLICABLE
    end

    private def purchase_order_number_current_contract
      district.subscription&.purchase_order_number || VITALLY_NOT_APPLICABLE
    end

    private def total_premium_months
      district.subscriptions.map(&:length_in_months).sum
    end
  end
end
