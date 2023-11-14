# frozen_string_literal: true

require 'rails_helper'

describe Cms::DistrictAdminsController do
  let(:user) { create(:staff) }
  let!(:district1) { create(:district) }
  let!(:district2) { create(:district) }
  let!(:school) { create(:school, district: district1)}
  let!(:admin) { create(:user) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#create' do
    describe 'for a new user' do
      let(:test_email) { 'test@email.com' }

      it 'creates the user admin info record as staff approved' do
        post :create, params: { district_id: district1.id, email: test_email, first_name: 'Test', last_name: 'User' }

        new_user = User.find_by(email: test_email)
        expect(new_user.admin_info.approver_role).to eq(User::STAFF)
        expect(new_user.admin_info.approval_status).to eq(AdminInfo::APPROVED)
      end

      it 'creates a new user account and district admin, and sends the expected email' do
        Sidekiq::Testing.inline! do
          post :create, params: { district_id: district1.id, email: test_email, first_name: 'Test', last_name: 'User' }

          new_user = User.find_by(email: test_email)
          expect(new_user).to be
          expect(DistrictAdmin.find_by_user_id(new_user.id)).to be
          expect(ActionMailer::Base.deliveries.last.subject).to eq('[Action Required] Test, a Quill district admin account was created for you')
          expect(ActionMailer::Base.deliveries.last.to).to eq([test_email])
        end
      end

      it 'attaches the user as admin to the specified schools' do
        email = test_email
        post :create, params: { district_id: district1.id, email: email, first_name: 'Test', last_name: 'User', school_ids: [school.id] }

        new_user = User.find_by(email: email)
        expect(SchoolsAdmins.where(user: new_user, school: school).first).to be
      end

      it 'if a specified school has premium, attaches the user to that school' do
        email = test_email
        create(:school_subscription, school: school)
        post :create, params: { district_id: district1.id, email: email, first_name: 'Test', last_name: 'User', school_ids: [school.id] }

        new_user = User.find_by(email: email)
        expect(SchoolsUsers.where(user: new_user, school: school).first).to be
      end
    end

    describe 'for an existing user' do
      describe 'who already has an admin info record' do
        let!(:admin_info) { create(:admin_info, user: admin, approval_status: AdminInfo::PENDING, approver_role: User::ADMIN )}

        it 'updates the admin info record to be staff approved' do
          post :create, params: { district_id: district1.id, email: admin.email}

          expect(admin.admin_info.reload.approver_role).to eq(User::STAFF)
          expect(admin.admin_info.reload.approval_status).to eq(AdminInfo::APPROVED)
        end
      end

      describe 'who does not already have an admin info record' do
        it 'creates the admin info record as staff approved' do
          post :create, params: { district_id: district1.id, email: admin.email}

          expect(admin.admin_info.approver_role).to eq(User::STAFF)
          expect(admin.admin_info.approval_status).to eq(AdminInfo::APPROVED)
        end
      end

      it 'creates a new district admin and sends the expected email' do
        Sidekiq::Testing.inline! do
          post :create, params: { district_id: district2.id, email: admin.email}

          expect(DistrictAdmin.find_by_user_id(admin.id)).to be
          expect(ActionMailer::Base.deliveries.last.subject).to eq("#{admin.first_name}, you are now a Quill admin for #{district2.name}")
          expect(ActionMailer::Base.deliveries.last.to).to eq([admin.email])
        end
      end

      it 'does not create a new district admin if one already exists' do
        create(:district_admin, district: district1, user: admin)
        expect(DistrictAdmin.count).to eq(1)

        post :create, params: { district_id: district1.id, email: admin.email}

        expect(DistrictAdmin.count).to eq(1)
      end
    end
  end

  describe '#destroy' do
    it 'destroys the district admin' do
      create(:district_admin, district: district1, user: admin)
      district_admin = DistrictAdmin.find_by_user_id(admin.id)

      delete :destroy, params: { district_id: district1.id, id: district_admin.id}

      expect(DistrictAdmin.find_by_user_id(admin.id)).not_to be
    end
  end
end
