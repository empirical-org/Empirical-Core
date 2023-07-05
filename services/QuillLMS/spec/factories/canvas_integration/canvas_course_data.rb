# frozen_string_literal: true

module CanvasIntegration
  FactoryBot.define do
    factory :canvas_course_data, class: Hash do
      skip_create

      initialize_with do
        {
          id: id,
          name: name,
          account_id: account_id,
          uuid:  uuid,
          start_at: nil,
          grading_standard_id: nil,
          is_public: nil,
          created_at: created_at,
          course_code: course_code,
          default_view: :modules,
          root_account_id: 1,
          enrollment_term_id: 1,
          license: nil,
          grade_passback_setting: nil,
          end_at: nil,
          public_syllabus: false,
          public_syllabus_to_auth: false,
          storage_quota_mb: 500,
          is_public_to_auth_users: false,
          homeroom_course: false,
          course_color: nil,
          friendly_name: nil,
          apply_assignment_group_weights: false,
          time_zone: time_zone,
          blueprint: false,
          template: false,
          sis_course_id: nil,
          sis_import_id: nil,
          integration_id: nil,
          enrollments: [
            {
              type: :teacher,
              role: :TeacherEnrollment,
              role_id: 4,
              user_id: id,
              enrollment_state: :active,
              limit_privileges_to_course_section: false
            }
          ],
          hide_final_grades: false,
          workflow_state: :unpublished,
          restrict_enrollments_to_course_dates: false
        }.deep_stringify_keys
      end

      transient do
        sequence(:account_id)
        course_code { :College }
        created_at { Time.zone.now.strftime("%Y-%m-%dT%H:%M:%SZ") }
        sequence(:id)
        name { Faker::Educator.subject }
        time_zone { Faker::Address.time_zone }
        uuid { SecureRandom.hex(20) }
      end
    end
  end
end

