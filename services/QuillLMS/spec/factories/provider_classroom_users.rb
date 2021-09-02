# == Schema Information
#
# Table name: provider_classroom_user_imports
#
#  id                    :bigint           not null, primary key
#  deleted_at            :datetime
#  type                  :string           not null
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  provider_classroom_id :string           not null
#  provider_user_id      :string           not null
#
FactoryBot.define do
  factory :provider_classroom_user, class: 'ProviderClassroomUser' do
    provider_classroom_id { (1..10).map { (1..9).to_a.sample }.join }
    provider_user_id { (1..21).map{(1..9).to_a.sample}.join }

    trait(:active) { deleted_at { nil } }
    trait(:deleted) { deleted_at { Time.now } }

    factory :google_classroom_user, parent: :provider_classroom_user, class: 'GoogleClassroomUser'
    factory :clever_classroom_user, parent: :provider_classroom_user, class: 'CleverClassroomUser'
  end
end
