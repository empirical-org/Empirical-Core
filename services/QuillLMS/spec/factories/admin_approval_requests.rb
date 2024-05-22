# frozen_string_literal: true

# == Schema Information
#
# Table name: admin_approval_requests
#
#  id                          :bigint           not null, primary key
#  request_made_during_sign_up :boolean          default(FALSE)
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#  admin_info_id               :bigint
#  requestee_id                :integer
#
# Indexes
#
#  index_admin_approval_requests_on_admin_info_id  (admin_info_id)
#
# Foreign Keys
#
#  fk_rails_...  (admin_info_id => admin_infos.id)
#
FactoryBot.define do
  factory :admin_approval_request do
    association :admin_info, factory: :admin_info
    association :requestee, factory: :admin
    request_made_during_sign_up { [true, false].sample }
  end
end
