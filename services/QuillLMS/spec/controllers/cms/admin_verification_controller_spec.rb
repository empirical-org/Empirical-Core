# frozen_string_literal: true

require 'rails_helper'

describe Cms::AdminVerificationController do
  let(:user) { create(:staff) }

  before { allow(controller).to receive(:current_user) { user } }

  describe '#index' do
    it 'returns admin infos grouped by approval status' do
      pending_requests = create_list(:admin_info, 3, approval_status: AdminInfo::PENDING, approver_role: User::STAFF)
      completed_requests = create_list(:admin_info, 10, approval_status: [AdminInfo::APPROVED, AdminInfo::DENIED].sample, approver_role: User::STAFF)

      get :index, { format: 'json' }
      parsed_response = JSON.parse(response.body)

      pending_results = parsed_response["pending"]
      pending_requests.each do |t|
        expect(pending_results.find { |tr| tr["admin_info_id"] == t.id }).to be
      end

      completed_results = parsed_response["completed"]
      completed_requests.each do |t|
        expect(completed_results.find { |tr| tr["admin_info_id"] == t.id }).to be
      end
    end

    it 'does not fail if a user has no ip location' do
      user = create(:admin, ip_address: nil)
      create(:admin_info, user: user)

      get :index, { format: 'json' }
      expect(response).to have_http_status(:ok)
    end
  end

  describe '#set_approved' do
    let(:admin) { create(:teacher) }
    let!(:schools_users) { create(:schools_users, user: admin )}
    let!(:admin_info) { create(:admin_info, approval_status: AdminInfo::PENDING, admin: admin, approver_role: User::STAFF) }

    it 'updates the admin info record, creates a school admin record, and fires an email and identify worker' do
      admin.reload
      expect(IdentifyWorker).to receive(:perform_async).with(admin.id)
      expect(ApprovedAdminVerificationEmailWorker).to receive(:perform_async).with(admin.id, admin.school.id)
      put :set_approved, params: { admin_info_id: admin_info.id }, as: :json
      expect(SchoolsAdmins.find_by(user: admin, school: admin.school)).to be
      expect(admin_info.reload.approval_status).to eq(AdminInfo::APPROVED)
    end
  end

  describe '#set_denied' do
    let(:admin) { create(:teacher) }
    let!(:schools_users) { create(:schools_users, user: admin )}
    let!(:admin_info) { create(:admin_info, approval_status: AdminInfo::PENDING, admin: admin, approver_role: User::STAFF) }

    it 'updates the admin info record and fires an email and identify worker' do
      admin.reload
      expect(IdentifyWorker).to receive(:perform_async).with(admin.id)
      expect(DeniedAdminVerificationEmailWorker).to receive(:perform_async).with(admin.id, admin.school.id)
      put :set_denied, params: { admin_info_id: admin_info.id }, as: :json
      expect(admin_info.reload.approval_status).to eq(AdminInfo::DENIED)
    end
  end

  describe '#set_pending' do
    let(:admin) { create(:teacher) }
    let!(:schools_users) { create(:schools_users, user: admin )}

    describe 'if the request had been approved' do
      let!(:admin_info) { create(:admin_info, approval_status: AdminInfo::APPROVED, admin: admin, approver_role: User::STAFF) }
      let!(:schools_admins) { create(:schools_admins, school: admin.reload.school, user: admin) }

      it 'updates the admin info record, deletes the school admin record, and fires an identify worker' do
        expect(IdentifyWorker).to receive(:perform_async).with(admin.id)
        put :set_pending, params: { admin_info_id: admin_info.id }, as: :json
        expect(admin_info.reload.approval_status).to eq(AdminInfo::PENDING)
        expect(SchoolsAdmins.find_by(school: admin.reload.school, user: user)).not_to be
      end
    end

    describe 'if the request had been denied' do
      let!(:admin_info) { create(:admin_info, approval_status: AdminInfo::DENIED, admin: admin, approver_role: User::STAFF) }
      let!(:schools_admins) { create(:schools_admins, school: admin.reload.school, user: admin) }

      it 'updates the admin info record and fires an identify worker' do
        expect(IdentifyWorker).to receive(:perform_async).with(admin.id)
        put :set_pending, params: { admin_info_id: admin_info.id }, as: :json
        expect(admin_info.reload.approval_status).to eq(AdminInfo::PENDING)
      end
    end

  end

end
