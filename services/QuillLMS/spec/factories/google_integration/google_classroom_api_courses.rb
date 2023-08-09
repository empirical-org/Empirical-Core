# frozen_string_literal: true

module GoogleIntegration
  FactoryBot.define do
    factory :google_classroom_api_course, class: Google::Apis::ClassroomV1::Course do
      skip_create

      initialize_with do
        new(
          course_state: course_state,
          creation_time: creation_time,
          id: id,
          name: name,
          owner_id: owner_id,
          section: section
        )
      end

      transient do
        course_state { RestClient::ACTIVE_STATE }
        creation_time { Time.current.iso8601(3) }
        id { Faker::Number.number(digits: 12) }
        name { Faker::Educator.course_name }
        owner_id { Faker::Number.number(digits: 21) }
        section { nil }
      end

      trait(:active) { course_state { RestClient::ACTIVE_STATE } }
      trait(:archived) { course_state { RestClient::ARCHIVED_STATE } }
    end
  end
end
