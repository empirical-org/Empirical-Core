# frozen_string_literal: true

module SegmentIntegration
  class User < SimpleDelegator
    def identify_params
      {
        user_id: id,
        traits: {
          **common_params,
          **school_params,
          auditor: auditor?,
          first_name: first_name,
          last_name: last_name,
          email: email,
          flags: flags&.join(", "),
          flagset: flagset,
          minimum_grade_level: teacher_info&.minimum_grade_level,
          maximum_grade_level: teacher_info&.maximum_grade_level,
          subject_areas: teacher_info&.subject_areas_string
        }.reject {|_,v| v.nil? },
        integrations: integration_rules
      }
    end

    # rubocop:disable Metrics/CyclomaticComplexity
    def common_params
      {
        district: school&.district_name,
        school_id: school&.id,
        school_name: school&.name,
        premium_state: premium_state,
        premium_type: subscription&.account_type,
        is_admin: admin?,
        minimum_grade_level: teacher_info&.minimum_grade_level,
        maximum_grade_level: teacher_info&.maximum_grade_level,
        subject_areas: teacher_info&.subject_areas_string,
        role: role,
        admin_sub_role: admin_sub_role,
        email_verification_status: email_verification_status,
        admin_approval_status: admin_approval_status,
        admin_reason: admin_verification_reason,
        admin_linkedin_or_url: admin_verification_url,
        number_of_schools_administered: schools_admins.any? ? schools_admins.count : nil,
        number_of_districts_administered: district_admins.any? ? district_admins.count : nil
      }.reject {|_,v| v.nil? }
    end
    # rubocop:enable Metrics/CyclomaticComplexity

    def premium_params
      {
        email: email,
        premium_state: premium_state,
        premium_type: subscription&.account_type,
      }.reject {|_,v| v.nil? }
    end

    def school_params
      if admin? && school && School::ALTERNATIVE_SCHOOL_NAMES.exclude?(school.name)
        cache = CacheSegmentSchoolData.new(school).read

        {
          total_teachers_at_school: cache[CacheSegmentSchoolData::TOTAL_TEACHERS_AT_SCHOOL],
          total_students_at_school: cache[CacheSegmentSchoolData::TOTAL_STUDENTS_AT_SCHOOL],
          total_activities_completed_by_students_at_school: cache[CacheSegmentSchoolData::TOTAL_ACTIVITIES_COMPLETED_BY_STUDENTS_AT_SCHOOL],
          active_teachers_at_school_this_year: cache[CacheSegmentSchoolData::ACTIVE_TEACHERS_AT_SCHOOL_THIS_YEAR],
          active_students_at_school_this_year: cache[CacheSegmentSchoolData::ACTIVE_STUDENTS_AT_SCHOOL_THIS_YEAR],
          total_activities_completed_by_students_at_school_this_year: cache[CacheSegmentSchoolData::TOTAL_ACTIVITIES_COMPLETED_BY_STUDENTS_AT_SCHOOL_THIS_YEAR]
        }.reject {|_,v| v.nil? }
      else
        {}
      end
    end

    def integration_rules
      { all: true, Intercom: (teacher?) }
    end
  end
end
