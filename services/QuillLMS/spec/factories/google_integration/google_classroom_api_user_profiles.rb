# frozen_string_literal: true

module GoogleIntegration
  FactoryBot.define do
    factory :google_classroom_api_user_profile, class: Google::Apis::ClassroomV1::UserProfile do
      skip_create

      initialize_with do
        new(
          email_address: email,
          id: user_id,
          name: name
        )
      end

      transient do
        email { Faker::Internet.email }
        user_id { Faker::Number.number(21) }
        name { create(:google_classroom_api_name) }
      end
    end
  end
end
