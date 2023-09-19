# frozen_string_literal: true

module GoogleIntegration
  FactoryBot.define do
    factory :google_classroom_api_name, class: 'Google::Apis::ClassroomV1::Name' do
      skip_create

      initialize_with do
        new(
          family_name: family_name,
          full_name: full_name,
          given_name: given_name
        )
      end

      transient do
        family_name { full_name.split.last }
        full_name { Faker::Name.custom_name }
        given_name { full_name.split.first }
      end
    end
  end
end
