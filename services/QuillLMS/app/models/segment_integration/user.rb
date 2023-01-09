# frozen_string_literal: true

module SegmentIntegration
  class User < SimpleDelegator
    def identify_params
      {
        user_id: id,
        traits: {
          **common_params,
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
        subject_areas: teacher_info&.subject_areas_string
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

    def integration_rules
      { all: true, Intercom: (teacher?) }
    end
  end
end
