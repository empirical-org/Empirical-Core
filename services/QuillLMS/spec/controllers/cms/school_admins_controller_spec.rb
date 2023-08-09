# frozen_string_literal: true

require 'rails_helper'

describe Cms::SchoolAdminsController do
  let(:user) { create(:staff) }
  let(:new_user_email) { 'test@email.com' }
  let!(:school1) { create(:school) }
  let!(:school2) { create(:school) }
  let!(:admin1) { create(:user) }
  let!(:admin2) { create(:user) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#create' do
    describe 'for a new user' do
      it 'creates the user admin info record as staff approved' do
        post :create, params: { school_id: school1.id, email: new_user_email, first_name: 'Test', last_name: 'User' }

        new_user = User.find_by(email: 'test@email.com')
        expect(new_user.admin_info.approver_role).to eq(User::STAFF)
        expect(new_user.admin_info.approval_status).to eq(AdminInfo::APPROVED)
      end

      it 'creates a new user account and school admin and sends the expected email' do
        Sidekiq::Testing.inline! do
          post :create, params: { school_id: school1.id, email: 'test@email.com', first_name: 'Test', last_name: 'User' }

          new_user = User.find_by(email: 'test@email.com')
          expect(new_user).to be
          expect(SchoolsAdmins.find_by_user_id(new_user.id)).to be
          expect(school1.users.last).to eq(new_user)
          expect(ActionMailer::Base.deliveries.last.subject).to eq('[Action Required] Test, a Quill school admin account was created for you')
          expect(ActionMailer::Base.deliveries.last.to).to eq(['test@email.com'])
        end
      end
    end

    describe 'for an existing admin user' do
      describe 'who already has an admin info record' do
        let!(:admin_info) { create(:admin_info, user: admin1, approval_status: AdminInfo::PENDING, approver_role: User::ADMIN )}

        it 'updates the admin info record to be staff approved' do
          post :create, params: { school_id: school1.id, email: admin1.email}

          expect(admin1.admin_info.reload.approver_role).to eq(User::STAFF)
          expect(admin1.admin_info.reload.approval_status).to eq(AdminInfo::APPROVED)
        end
      end

      describe 'who does not already have an admin info record' do
        it 'creates the admin info record as staff approved' do
          post :create, params: { school_id: school1.id, email: admin1.email}

          expect(admin1.admin_info.approver_role).to eq(User::STAFF)
          expect(admin1.admin_info.approval_status).to eq(AdminInfo::APPROVED)
        end
      end

      it 'creates a new school admin with no linked school and sends the expected email' do
        Sidekiq::Testing.inline! do
          post :create, params: { school_id: school1.id, email: admin1.email}

          body_contains_expected_content = ActionMailer::Base.deliveries.last.encoded.include?("To receive access to premium features, please link your account")

          expect(SchoolsAdmins.find_by_user_id(admin1.id)).to be
          expect(ActionMailer::Base.deliveries.last.subject).to eq("#{admin1.first_name}, you are now a Quill admin for #{school1.name}")
          expect(ActionMailer::Base.deliveries.last.to).to eq([admin1.email])
          expect(body_contains_expected_content).to be true
        end
      end

      it 'creates a new school admin linked to school and sends the expected email' do
        Sidekiq::Testing.inline! do
          school1.users.push(admin1)
          admin1.reload
          post :create, params: { school_id: school1.id, email: admin1.email}

          body_contains_expected_content = !ActionMailer::Base.deliveries.last.encoded.include?("To receive access to premium features, please link your account")
          expect(SchoolsAdmins.find_by_user_id(admin1.id)).to be
          expect(ActionMailer::Base.deliveries.last.subject).to eq("#{admin1.first_name}, you are now a Quill admin for #{school1.name}")
          expect(ActionMailer::Base.deliveries.last.to).to eq([admin1.email])
          expect(body_contains_expected_content).to be true
        end
      end

      it 'creates a new school admin linked to a different school and sends the expected email' do
        Sidekiq::Testing.inline! do
          school2.users.push(admin2)
          admin2.reload
          post :create, params: { school_id: school1.id, email: admin2.email}

          body_contains_expected_content = ActionMailer::Base.deliveries.last.encoded.include?("Your account is currently linked to #{school2.name}")
          expect(SchoolsAdmins.find_by_user_id(admin2.id)).to be
          expect(ActionMailer::Base.deliveries.last.subject).to eq("#{admin2.first_name}, you are now a Quill admin for #{school1.name}")
          expect(ActionMailer::Base.deliveries.last.to).to eq([admin2.email])
          expect(body_contains_expected_content).to be true
        end
      end

      it 'creates a new school admin for an existing admin user and does not send an additional email' do
        Sidekiq::Testing.inline! do
          school2.users.push(admin2)
          admin2.reload
          post :create, params: { school_id: school1.id, email: admin2.email}
          post :create, params: { school_id: school2.id, email: admin2.email}

          expect(ActionMailer::Base.deliveries.count).to eq(1)
        end
      end

    end

  end
end
