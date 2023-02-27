# frozen_string_literal: true

require 'rails_helper'

describe AdminInfosController do
  let(:user) { create(:admin) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#update' do
    let(:sub_role) { AdminInfo::SUB_ROLES.sample }
    let(:verification_reason) { "A reason I should be verified." }
    let(:verification_url) { 'quill.org/team' }

    describe 'when there already is an admin info record' do

      it 'should update it with the params' do
        admin_info = create(:admin_info, user: user)
        put :update, params: { sub_role: sub_role, verification_reason: verification_reason, verification_url: verification_url }
        expect(admin_info.reload.sub_role).to eq(sub_role)
        expect(admin_info.reload.verification_reason).to eq(verification_reason)
        expect(admin_info.reload.verification_url).to eq(verification_url)
      end

      describe 'when the admin info record has a skipped approval status and now has a verification reason and url' do
        it 'should call the UserRequestedAdminVerificationEmailWorker and set the approval status to PENDING' do
          admin_info = create(:admin_info, user: user, approval_status: AdminInfo::SKIPPED)

          expect(UserRequestedAdminVerificationEmailWorker).to receive(:perform_async).with(user.id)
          put :update, params: { verification_reason: verification_reason, verification_url: verification_url }
          expect(admin_info.reload.approval_status).to eq(AdminInfo::PENDING)
        end
      end

      describe 'when the admin info record has a skipped approval status but no verification reason or url' do
        it 'should leave the approval status as SKIPPED' do
          admin_info = create(:admin_info, user: user, approval_status: AdminInfo::SKIPPED, verification_reason: nil, verification_url: nil)
          put :update, params: { sub_role: sub_role }
          expect(admin_info.reload.approval_status).to eq(AdminInfo::SKIPPED)
        end
      end

    end

    describe 'when there is not already is an admin info record' do
      it 'should update it with the params' do
        put :update, params: { sub_role: sub_role, verification_reason: verification_reason, verification_url: verification_url }
        expect(user.admin_info.reload.sub_role).to eq(sub_role)
        expect(user.admin_info.reload.verification_reason).to eq(verification_reason)
        expect(user.admin_info.reload.verification_url).to eq(verification_url)
      end

    end

  end
end
