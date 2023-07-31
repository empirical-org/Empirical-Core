# frozen_string_literal: true

module CanvasIntegration
  FactoryBot.define do
    factory :google_classroom_student_payload, class: Hash do
      skip_create

      initialize_with do
        {
          profile: {
            id: id,
            name: {
              givenName: given_name,
              familyName: family_name,
              fullName: full_name
            },
            emailAddress: email_address
          }
        }.as_json
      end

      transient do
        sequence(:id)
        full_name { Faker::Name.custom_name }
        family_name { full_name.split.last }
        given_name { full_name.split.first }
        email_address { Faker::Internet.email }
      end
    end
  end
end
