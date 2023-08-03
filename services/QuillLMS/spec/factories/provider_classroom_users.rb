# frozen_string_literal: true

# == Schema Information
#
# Table name: provider_classroom_users
#
#  id                    :bigint           not null, primary key
#  deleted_at            :datetime
#  type                  :string           not null
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  classroom_external_id :string           not null
#  user_external_id      :string           not null
#
# Indexes
#
#  index_provider_type_and_classroom_id_and_user_id  (type,classroom_external_id,user_external_id) UNIQUE
#
FactoryBot.define do
  factory :provider_classroom_user do

    trait(:active) { deleted_at { nil } }
    trait(:synced) { active }

    trait(:deleted) { deleted_at { Time.current } }
    trait(:unsynced) { deleted }

    factory :canvas_classroom_user, parent: :provider_classroom_user, class: CanvasClassroomUser do
      classroom_external_id { [Faker::Number.number, Faker::Number.number].join(':') }
      user_external_id { [Faker::Number.number, Faker::Number.number].join(':') }
    end

    factory :clever_classroom_user, parent: :provider_classroom_user, class: CleverClassroomUser do
      classroom_external_id { SecureRandom.hex(12) }
      user_external_id { SecureRandom.hex(12) }
    end

    factory :google_classroom_user, parent: :provider_classroom_user, class: GoogleClassroomUser do
      classroom_external_id { Faker::Number.number }
      user_external_id { Faker::Number.number }
    end
  end
end
