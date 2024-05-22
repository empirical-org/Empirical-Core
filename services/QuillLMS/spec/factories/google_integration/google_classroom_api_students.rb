# frozen_string_literal: true

module GoogleIntegration
  FactoryBot.define do
    factory :google_classroom_api_student, class: 'Google::Apis::ClassroomV1::Student' do
      skip_create

      initialize_with do
        new(
          course_id: course_id,
          profile: profile,
          user_id: user_id
        )
      end

      transient do
        course_id { Faker::Number.number(digits: 12) }
        profile { create(:google_classroom_api_user_profile, user_id: user_id) }
        user_id { Faker::Number.number(digits: 21) }
      end
    end
  end
end
