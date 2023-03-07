# frozen_string_literal: true

# == Schema Information
#
# Table name: admin_approval_requests
#
#  id            :bigint           not null, primary key
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  admin_info_id :bigint
#  requestee_id  :integer
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
    requestee.schools_admins&.first&.wipe_cache
  end
end
