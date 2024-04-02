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
class AdminApprovalRequest < ApplicationRecord
  belongs_to :requestee, class_name: 'User'
  belongs_to :admin_info

  validates :requestee_id, presence: true
  validates :admin_info_id, presence: true

  after_create :wipe_cache_for_requestee

  def wipe_cache_for_requestee
    # it doesn't matter which school admin record we call this for because the caches affected by wipe_cache are only based on the user id
    requestee.schools_admins&.first&.wipe_cache
  end
end
