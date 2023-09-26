# frozen_string_literal: true

module GoogleIntegration
  FactoryBot.define do
    factory :google_classroom_api_list_students_response, class: 'Google::Apis::ClassroomV1::ListStudentsResponse' do
      skip_create

      initialize_with { new(students: students, next_page_token: next_page_token) }

      transient do
        course_id { Faker::Number.number(digits: 12) }
        next_page_token { nil }
        num_students { 2 }

        students do
          num_students.zero? ? nil : create_list(:google_classroom_api_student, num_students, course_id: course_id)
        end
      end
    end
  end
end
