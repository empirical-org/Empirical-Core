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
#  canvas_instance_id    :bigint
#  classroom_external_id :string           not null
#  user_external_id      :string           not null
#
# Indexes
#
#  index_provider_classroom_users_on_canvas_instance_id  (canvas_instance_id)
#  index_provider_type_and_classroom_id_and_user_id      (type,classroom_external_id,user_external_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (canvas_instance_id => canvas_instances.id)
#
FactoryBot.define do
  factory :provider_classroom_user, class: 'ProviderClassroomUser' do
    classroom_external_id { (1..10).map { (1..9).to_a.sample }.join }
    user_external_id { (1..21).map{(1..9).to_a.sample}.join }

    trait(:active) { deleted_at { nil } }
    trait(:deleted) { deleted_at { Time.current } }

    factory :google_classroom_user, parent: :provider_classroom_user, class: 'GoogleClassroomUser'
    factory :clever_classroom_user, parent: :provider_classroom_user, class: 'CleverClassroomUser'
  end
end
