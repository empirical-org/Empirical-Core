# frozen_string_literal: true

module GoogleIntegration
  FactoryBot.define do
    factory :google_classroom_api_list_courses_response, class: 'Google::Apis::ClassroomV1::ListCoursesResponse'  do
      skip_create

      initialize_with { new(courses: courses, next_page_token: next_page_token) }

      transient do
        courses do
          num_courses.zero? ? nil : create_list(:google_classroom_api_list_course, num_courses, owner_id: owner_id)
        end

        next_page_token { nil }
        num_courses { 0 }
        owner_id { Faker::Number.number(digits: 21) }
      end
    end
  end
end
