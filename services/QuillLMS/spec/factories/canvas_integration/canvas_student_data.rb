# frozen_string_literal: true

module CanvasIntegration
  FactoryBot.define do
    factory :canvas_student_data, class: Hash do
      skip_create

      initialize_with do
        {
          id: id,
          name: name,
          created_at: created_at,
          sortable_name: name.split.reverse.join(', '),
          short_name: name.split.first,
          sis_user_id: nil,
          integration_id: nil,
          login_id: email
        }.stringify_keys
      end

      transient do
        sequence(:id)
        created_at { Time.zone.now.strftime("%Y-%m-%dT%H:%M:%SZ") }
        name { Faker::Name.name }
        email { Faker::Internet.email }
      end
    end
  end
end
