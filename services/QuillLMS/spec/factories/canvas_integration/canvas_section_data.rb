# frozen_string_literal: true

module CanvasIntegration
  FactoryBot.define do
    factory :canvas_section_data, class: Hash do
      skip_create

      initialize_with do
        {
          id: id,
          course_id: course_id,
          name: name,
          start_at: nil,
          end_at: nil,
          created_at: created_at,
          restrict_enrollments_to_section_dates: nil,
          nonxlist_course_id: nil,
          sis_section_id: nil,
          sis_course_id: nil,
          integration_id: nil,
          students: students
        }.deep_stringify_keys
      end

      transient do
        sequence(:course_id)
        created_at { Time.zone.now.strftime("%Y-%m-%dT%H:%M:%SZ") }
        sequence(:id)
        sequence(:name) { |n| "Section #{n}" }
        students { nil }
      end
    end
  end
end
