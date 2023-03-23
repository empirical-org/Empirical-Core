# frozen_string_literal: true

require 'rails_helper'

describe AdminAccessController do
  let(:user) { create(:teacher) }
  let!(:schools_users) { create(:schools_users, user: user) }
  let(:school) { schools_users.school }
  let!(:school_admin) { create(:schools_admins, school: school) }

  before do
    allow(controller).to receive(:current_user) { user.reload }
  end

  describe '#index' do
    describe 'has_verified_email' do
      it 'assigns true if the email has already been verified' do
        user.email_verification_status= UserEmailVerification::VERIFIED

        get :index
        expect(assigns(:has_verified_email)).to eq true
      end

      it 'assigns false if the email has not yet been verified' do
        get :index
        expect(assigns(:has_verified_email)).to eq false
      end
    end

    describe 'school' do
      it "assigns the value of the user's school" do
        get :index
        expect(assigns(:school)).to eq user.school
      end
    end

    describe 'has school premium' do
      it 'assigns true if the school has a valid subscription' do
        create(:school_subscription, school: school)

        get :index
        expect(assigns(:has_school_premium)).to eq true
      end

      it 'assigns false if the school does not have a valid subscription' do
        get :index
        expect(assigns(:has_school_premium)).to eq false
      end
    end

    describe 'school admins' do
      it 'assigns an array of user objects for the school admins' do
        get :index
        expect(assigns(:school_admins)).to eq [school_admin.user]
      end
    end
  end

  describe '#upgrade_to_admin' do
    it 'makes the user an admin and creates an admin info record with the requisite information' do
      post :upgrade_to_admin

      expect(user.role).to eq(User::ADMIN)
      expect(user.admin_info.approval_status).to eq(AdminInfo::SKIPPED)
      expect(user.admin_info.approver_role).to eq(User::STAFF)
      expect(user.admin_info.sub_role).to eq(AdminInfo::TEACHER_ADMIN)
    end
  end

  describe '#request_upgrade_to_admin_from_existing_admins' do
    it 'creates an admin info record with the requisite information, an admin approval request record, and fires the necessary segment workers' do
      reason = 'I really want to be an admin.'
      new_user = [true, false].sample

      expect(AdminReceivedAdminUpgradeRequestFromTeacherAnalyticsWorker).to receive(:perform_async).with(school_admin.user.id.to_s, user.id, reason, new_user)
      expect(TeacherRequestedToBecomeAdminAnalyticsWorker).to receive(:perform_async).with(user.id, new_user)

      post :request_upgrade_to_admin_from_existing_admins, params: { admin_ids: [school_admin.user.id], reason: reason, new_user: new_user }

      expect(user.admin_info.approval_status).to eq(AdminInfo::PENDING)
      expect(user.admin_info.approver_role).to eq(User::ADMIN)
      expect(AdminApprovalRequest.find_by(admin_info: user.admin_info, requestee_id: school_admin.user.id, request_made_during_sign_up: new_user)).to be
    end
  end

  describe '#invite_admin' do
    it 'should call the necessary segment workers' do
      note = 'Please be an admin.'
      admin_name = 'Audre Lorde'
      admin_email = 'audrelorde@gmail.com'

      expect(AdminInvitedByTeacherAnalyticsWorker).to receive(:perform_async).with(admin_name, admin_email, user.id, note)
      expect(TeacherInvitedAdminAnalyticsWorker).to receive(:perform_async).with(user.id, admin_name, admin_email, note)

      post :invite_admin, params: { admin_name: admin_name, admin_email: admin_email, note: note }
    end
  end

end
