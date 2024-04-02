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
require 'rails_helper'

describe AdminApprovalRequest, type: :model, redis: true do
  it { should belong_to(:admin_info) }
  it { should belong_to(:requestee) }

  it { should validate_presence_of(:admin_info_id) }
  it { should validate_presence_of(:requestee_id) }

  describe '#wipe_cache_for_requestee' do
    let(:admin_approval_request) { create(:admin_approval_request) }
    let!(:school_admin) { create(:schools_admins, user: admin_approval_request.requestee) }

    it 'should call .wipe_cache on the requestee school admin record' do
      expect_any_instance_of(SchoolsAdmins).to receive(:wipe_cache)

      admin_approval_request.wipe_cache_for_requestee
    end
  end
end
