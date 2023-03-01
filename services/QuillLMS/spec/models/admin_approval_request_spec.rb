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
require 'rails_helper'

describe AdminApprovalRequest, type: :model, redis: true do
  it { should belong_to(:admin_info) }
  it { should belong_to(:requestee) }

  it { should validate_presence_of(:admin_info_id) }
  it { should validate_presence_of(:requestee_id) }
end
