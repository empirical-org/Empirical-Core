# frozen_string_literal: true

# == Schema Information
#
# Table name: admin_infos
#
#  id                  :bigint           not null, primary key
#  approval_status     :string
#  sub_role            :string
#  verification_reason :text
#  verification_url    :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  user_id             :bigint           not null
#
# Indexes
#
#  index_admin_infos_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :admin_info do
    association :admin, factory: :user
  end
end
