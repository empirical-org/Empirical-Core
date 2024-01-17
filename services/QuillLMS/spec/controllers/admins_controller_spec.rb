# frozen_string_literal: true

require 'rails_helper'

describe AdminsController  do
  before { allow(controller).to receive(:current_user) { admin } }

  it { should use_before_action :admin! }
  it { should use_before_action :set_teacher }
  it { should use_before_action :admin_of_this_teacher! }
  it { should use_before_action :sign_in }

  let(:admin) { create(:teacher) }
  let!(:teacher) { create(:teacher_with_school) }
  let!(:school) { teacher.reload.school }
  let!(:schools_admins) { create(:schools_admins, school: school, user: admin) }

  describe '#show' do
    before { allow(UserAdminSerializer).to receive(:new) { "some json" } }

    it 'should render the correct json' do
      get :show, params: { id: teacher.id }
      expect(response.body).to eq(({id: admin.id}).to_json)
    end
  end

  describe '#admin_info' do
    let!(:admin_for_admin_info) { create(:admin)}

    before { allow(controller).to receive(:current_user) { admin_for_admin_info } }

    describe 'associated_school_has_premium' do

      describe 'when the user is not associated with a school' do
        it 'returns false' do
          get :admin_info, params: { id: admin_for_admin_info.id }
          expect(JSON.parse(response.body)['associated_school_has_premium']).to be false
        end
      end

      context 'when the user is associated with a school' do
        let(:school_for_admin_info) { create(:school )}
        let!(:schools_users) { create(:schools_users, school: school_for_admin_info, user: admin_for_admin_info) }

        describe 'with an active subscription' do
          it 'returns true' do
            create(:school_subscription, school: school_for_admin_info)
            admin_for_admin_info.reload
            get :admin_info, params: { id: admin_for_admin_info.id }
            expect(JSON.parse(response.body)['associated_school_has_premium']).to be true
          end
        end

        describe 'with an expired subscription' do
          it 'returns false' do
            create(:school_subscription, school: school)
            school.subscription.update(expiration: Time.zone.yesterday)
            admin_for_admin_info.reload
            get :admin_info, params: { id: admin_for_admin_info.id }
            expect(JSON.parse(response.body)['associated_school_has_premium']).to be false
          end
        end

        describe 'with no subscription' do
          it 'returns false' do
            get :admin_info, params: { id: admin_for_admin_info.id }
            expect(JSON.parse(response.body)['associated_school_has_premium']).to be false
          end
        end

      end
    end

    describe 'administers_school_with_premium' do
      describe 'when the user does not administer any schools' do
        it 'returns false' do
          get :admin_info, params: { id: admin_for_admin_info.id }
          expect(JSON.parse(response.body)['administers_school_with_premium']).to be false
        end
      end

      context 'when the user administers a school' do
        let(:school_for_admin_info) { create(:school) }
        let!(:school_admin_for_admin_info) { create(:schools_admins, school: school_for_admin_info, user: admin_for_admin_info) }

        describe 'with an active subscription' do
          it 'returns true' do
            create(:school_subscription, school: school_for_admin_info)
            admin_for_admin_info.reload
            get :admin_info, params: { id: admin_for_admin_info.id }
            expect(JSON.parse(response.body)['administers_school_with_premium']).to be true
          end
        end

        describe 'with an expired subscription' do
          it 'returns false' do
            create(:school_subscription, school: school_for_admin_info)
            school_for_admin_info.subscription.update(expiration: Time.zone.yesterday)
            admin_for_admin_info.reload
            get :admin_info, params: { id: admin_for_admin_info.id }
            expect(JSON.parse(response.body)['administers_school_with_premium']).to be false
          end
        end

        describe 'with no subscription' do
          it 'returns false' do
            get :admin_info, params: { id: admin_for_admin_info.id }
            expect(JSON.parse(response.body)['administers_school_with_premium']).to be false
          end
        end

      end

    end
  end

  describe 'administers_school_with_current_or_expired_premium' do
    describe 'when the user does not administer any schools' do
      it 'returns false' do
        get :admin_info, params: { id: admin_for_admin_info.id }
        expect(JSON.parse(response.body)['administers_school_with_current_or_expired_premium']).to be false
      end
    end

    context 'when the user administers a school' do
      let(:school_for_admin_info) { create(:school) }
      let!(:school_admin_for_admin_info) { create(:schools_admins, school: school_for_admin_info, user: admin_for_admin_info) }

      describe 'with an active subscription' do
        it 'returns true' do
          create(:school_subscription, school: school_for_admin_info)
          admin_for_admin_info.reload
          get :admin_info, params: { id: admin_for_admin_info.id }
          expect(JSON.parse(response.body)['administers_school_with_current_or_expired_premium']).to be true
        end
      end

      describe 'with an expired subscription' do
        it 'returns true' do
          create(:school_subscription, school: school_for_admin_info)
          school_for_admin_info.subscription.update(expiration: Time.zone.yesterday)
          admin_for_admin_info.reload
          get :admin_info, params: { id: admin_for_admin_info.id }
          expect(JSON.parse(response.body)['administers_school_with_current_or_expired_premium']).to be true
        end
      end

      describe 'with no subscription' do
        it 'returns false' do
          get :admin_info, params: { id: admin_for_admin_info.id }
          expect(JSON.parse(response.body)['administers_school_with_current_or_expired_premium']).to be false
        end
      end

    end

  end
end

  describe '#sign_in_classroom_manager' do
    it 'should redirect to teachers classrooms path' do
      get :sign_in_classroom_manager, params: { id: teacher.id }
      expect(response).to redirect_to teachers_classrooms_path
    end
  end

  describe '#sign_in_progress_reports' do
    it 'should redirect to progress reports standards classrooms path' do
      get :sign_in_progress_reports, params: { id: teacher.id }
      expect(response).to redirect_to teachers_progress_reports_standards_classrooms_path
    end
  end

  describe '#sign_in_accounts_path' do
    it 'should redirect to teaches my account path' do
      get :sign_in_account_settings, params: { id: teacher.id }
      expect(response).to redirect_to teachers_my_account_path
    end
  end

  describe '#resend_login_details' do
    it 'sets the user token and schedules a worker to expire the token in 30 days' do
      expect(ExpirePasswordTokenWorker).to receive(:perform_in).with(30.days, teacher.id)
      post :resend_login_details, params: { id: teacher.id, school_id: school.id, role: 'teacher' }
      expect(teacher.reload.token.present?).to be
    end

    describe 'and the submitted role is admin' do
      it 'creates a school admin record, returns a message, and fires an email worker' do
        expect(PremiumHub::AdminAccountCreatedEmailWorker).to receive(:perform_async)
        post :resend_login_details, params: { id: teacher.id, school_id: school.id, role: 'admin' }
        expect(response.body).to eq({message: I18n.t('admin.resend_login_details')}.to_json)
      end
    end

    describe 'and the submitted role is teacher' do
      it 'returns a message and fires an email worker' do
        expect(PremiumHub::TeacherAccountCreatedEmailWorker).to receive(:perform_async)
        post :resend_login_details, params: { id: teacher.id, school_id: school.id, role: 'teacher' }
        expect(response.body).to eq({message: I18n.t('admin.resend_login_details')}.to_json)
      end
    end
  end

  describe '#make_admin' do
    it 'should create a schools admins record, fire an email worker, and return a message' do
      expect(PremiumHub::MadeSchoolAdminEmailWorker).to receive(:perform_async)
      post :make_admin, params: { id: teacher.id, school_id: school.id  }
      expect(SchoolsAdmins.find_by(user_id: teacher.id, school_id: school.id)).to be
      expect(response.body).to eq({message: I18n.t('admin.make_admin')}.to_json)
    end
  end

  describe '#remove_as_admin' do

    before do
      create(:schools_admins, school: school, user: teacher)
    end

    it 'should destroy the schools admins record and return a message' do
      post :remove_as_admin, params: { id: teacher.id, school_id: school.id  }
      expect(SchoolsAdmins.find_by(user_id: teacher.id, school_id: school.id)).not_to be
      expect(response.body).to eq({message: I18n.t('admin.remove_admin')}.to_json)
    end
  end

  describe '#approve_admin_request' do

    [true, false].each do |request_made_during_sign_up|
      describe "when request_made_during_sign_up is #{request_made_during_sign_up}" do
        it 'should update the teacher admin info to be approved, create a school admin record, call the analytics worker, and return a message' do
          admin_info = create(:admin_info, user: teacher, approval_status: AdminInfo::PENDING)
          admin_approval_request = create(:admin_approval_request, admin_info: admin_info, requestee: admin, request_made_during_sign_up: request_made_during_sign_up )
          expect(TeacherApprovedToBecomeAdminAnalyticsWorker).to receive(:perform_async).with(teacher.id, admin_approval_request.request_made_during_sign_up)

          post :approve_admin_request, params: { id: teacher.id, school_id: school.id  }

          teacher.admin_info.reload
          expect(teacher.admin_info.approval_status).to eq(AdminInfo::APPROVED)
          expect(teacher.admin_info.sub_role).to eq(AdminInfo::TEACHER_ADMIN)
          expect(SchoolsAdmins.find_by(user: teacher, school: school)).to be
          expect(response.body).to eq({message: I18n.t('admin.approve_admin_request')}.to_json)
        end
      end
    end

  end

  describe '#deny_admin_request' do
    it 'should update the teacher admin info to be denied, call the analytics worker, and return a message' do
      admin_info = create(:admin_info, user: teacher, approval_status: AdminInfo::PENDING)
      admin_approval_request = create(:admin_approval_request, admin_info: admin_info, requestee: admin, request_made_during_sign_up: [true, false].sample )

      expect(TeacherDeniedToBecomeAdminAnalyticsWorker).to receive(:perform_async).with(teacher.id, admin_approval_request.request_made_during_sign_up)

      post :deny_admin_request, params: { id: teacher.id  }

      teacher.admin_info.reload
      expect(teacher.admin_info.approval_status).to eq(AdminInfo::DENIED)
      expect(response.body).to eq({message: I18n.t('admin.deny_admin_request')}.to_json)
    end
  end

  describe '#unlink_from_school' do
    it 'should destroy the schools users record and return a message' do
      post :unlink_from_school, params: { id: teacher.id }
      expect(teacher.reload.school).not_to be
      expect(response.body).to eq({message: I18n.t('admin.unlink_teacher_from_school')}.to_json)
    end
  end


  describe '#create_and_link_accounts' do
    describe 'when the current user is not an admin of the school' do
      it 'should have a 422 status code' do
        post :create_and_link_accounts, params: { id: admin.id, school_id: create(:school).id, teacher: { role: 'admin' } }
        expect(response.status).to eq 422
      end
    end

    describe 'when there exists a user with the submitted email address' do
      let!(:existing_teacher) { create(:teacher) }

      describe 'and the submitted role is admin' do
        describe 'and the user is already an admin for the school' do
          it 'returns a message' do
            create(:schools_admins, user: existing_teacher, school: school)

            post :create_and_link_accounts, params: { id: admin.id, school_id: school.id, teacher: { role: 'admin', email: existing_teacher.email }}
            expect(response.body).to eq({message: I18n.t('admin_created_account.existing_account.admin.linked', school_name: school.name)}.to_json)
          end
        end

        describe 'and the user is not already an admin for the school' do
          describe 'and they are not linked to a school' do
            it 'creates a school admin record, returns a message and fires an email worker' do
              expect(PremiumHub::MadeSchoolAdminLinkSchoolEmailWorker).to receive(:perform_async)
              post :create_and_link_accounts, params: { id: admin.id, school_id: school.id, teacher: { role: 'admin', email: existing_teacher.email }}
              expect(response.body).to eq({message: I18n.t('admin_created_account.existing_account.admin.new')}.to_json)
              expect(SchoolsAdmins.find_by(school: school, user: existing_teacher)).to be
            end
          end

          describe 'and they are linked to that school' do
            it 'creates a school admin record, returns a message and fires an email worker' do
              create(:schools_users, school: school, user: existing_teacher)

              expect(PremiumHub::MadeSchoolAdminEmailWorker).to receive(:perform_async)
              post :create_and_link_accounts, params: { id: admin.id, school_id: school.id, teacher: { role: 'admin', email: existing_teacher.email }}
              expect(response.body).to eq({message: I18n.t('admin_created_account.existing_account.admin.new')}.to_json)
              expect(SchoolsAdmins.find_by(school: school, user: existing_teacher)).to be
            end
          end

          describe 'and they are linked to a different school' do
            it 'creates a school admin record, returns a message and fires an email worker' do
              other_school = create(:school)
              create(:schools_users, school: other_school, user: existing_teacher)

              expect(PremiumHub::MadeSchoolAdminChangeSchoolEmailWorker).to receive(:perform_async)
              post :create_and_link_accounts, params: { id: admin.id, school_id: school.id, teacher: { role: 'admin', email: existing_teacher.email }}
              expect(response.body).to eq({message: I18n.t('admin_created_account.existing_account.admin.new')}.to_json)
              expect(SchoolsAdmins.find_by(school: school, user: existing_teacher)).to be
            end
          end

          describe 'and they are already an admin for another school' do
            it 'creates a school admin record, returns a message and does not send an additional email' do
              other_school = create(:school)
              create(:schools_users, school: other_school, user: existing_teacher)
              create(:schools_admins, user: existing_teacher, school: other_school)

              post :create_and_link_accounts, params: { id: admin.id, school_id: school.id, teacher: { role: 'admin', email: existing_teacher.email }}
              expect(response.body).to eq({message: I18n.t('admin_created_account.existing_account.admin.admin_for_other_school')}.to_json)
              expect(ActionMailer::Base.deliveries.count).to eq(0)
              expect(SchoolsAdmins.find_by(school: school, user: existing_teacher)).to be
            end
          end

        end

      end

      describe 'and the submitted role is teacher' do
        describe 'and the user is already a teacher at the school' do
          it 'returns a message' do
            create(:schools_users, user: existing_teacher, school: school)

            post :create_and_link_accounts, params: { id: admin.id, school_id: school.id, teacher: { role: 'teacher', email: existing_teacher.email }}
            expect(response.body).to eq({message: I18n.t('admin_created_account.existing_account.teacher.linked', school_name: school.name)}.to_json)
          end
        end

        describe 'and the user is not already a teacher at the school' do
          it 'returns a message and fires an email worker' do
            expect(PremiumHub::TeacherLinkSchoolEmailWorker).to receive(:perform_async)
            post :create_and_link_accounts, params: { id: admin.id, school_id: school.id, teacher: { role: 'teacher', email: existing_teacher.email }}
            expect(response.body).to eq({message: I18n.t('admin_created_account.existing_account.teacher.new', school_name: school.name)}.to_json)
          end
        end
      end
    end

    describe 'when there is not a teacher with the submitted email address' do
      let!(:email) { 'hello@quill.org'}
      let!(:first_name) { 'Hello' }
      let!(:last_name) { 'Quill' }

      it 'creates a user with the submitted params, sets their token, and schedules a worker to expire the token in 30 days' do
        expect(ExpirePasswordTokenWorker).to receive(:perform_in)
        post :create_and_link_accounts, params: { id: admin.id, school_id: school.id, teacher: { role: 'teacher', email: email, first_name: first_name, last_name: last_name }}
        user = User.find_by(role: 'teacher', email: email, name: "#{first_name} #{last_name}")
        expect(user.present?).to be
        expect(user.token.present?).to be
      end

      describe 'and the submitted role is admin' do
        it 'creates a school admin record, returns a message, and fires an email worker' do
          expect(PremiumHub::AdminAccountCreatedEmailWorker).to receive(:perform_async)
          post :create_and_link_accounts, params: { id: admin.id, school_id: school.id, teacher: { role: 'admin', email: email, first_name: first_name, last_name: last_name }}
          user = User.find_by(email: email)
          expect(SchoolsAdmins.find_by(user: user, school: school)).to be
          expect(response.body).to eq({message: I18n.t('admin_created_account.new_account.admin')}.to_json)
        end
      end

      describe 'and the submitted role is teacher' do
        it 'returns a message and fires an email worker' do
          expect(PremiumHub::TeacherAccountCreatedEmailWorker).to receive(:perform_async)
          post :create_and_link_accounts, params: { id: admin.id, school_id: school.id, teacher: { role: 'teacher', email: email, first_name: first_name, last_name: last_name }}
          expect(response.body).to eq({message: I18n.t('admin_created_account.new_account.teacher')}.to_json)
        end
      end

    end
  end

  describe '#vitally_professional_learning_manager_info' do
    let(:api_stub) { double }
    let(:vitally_district) { { 'keyRoles' => [{ 'keyRole' => { 'label' => 'CSM' }, 'vitallyUser' => { 'name' => 'Manager', 'email' => 'manager@quill.org' } }] } }
    let!(:admin_for_vitally) { create(:admin) }

    before do
      allow(controller).to receive(:current_user).and_return(admin_for_vitally)
      allow(VitallyIntegration::RestApi).to receive(:new).and_return(api_stub)
    end

    context 'when the user is associated with a district' do
      context 'when the user administers a district' do
        before do
          allow(api_stub).to receive(:get)
          .with(VitallyIntegration::RestApi::ENDPOINT_ORGANIZATIONS, anything)
          .and_return(vitally_district)
        end

        it 'retrieves professional learning manager info and renders it as json' do
          create(:district_admin, user: admin_for_vitally)
          get :vitally_professional_learning_manager_info, params: { id: admin_for_vitally.reload.id }
          expect(response).to be_successful
          expect(response.body).to eq(vitally_district['keyRoles'].first['vitallyUser'].to_json)
        end
      end

      context 'when the user administers a school' do
        before do
          allow(api_stub).to receive(:get)
          .with(VitallyIntegration::RestApi::ENDPOINT_ORGANIZATIONS, anything)
          .and_return(vitally_district)
        end

        it 'retrieves professional learning manager info and renders it as json' do
          district = create(:district)
          school = create(:school, district: district)
          create(:schools_admins, user: admin_for_vitally, school: school)
          get :vitally_professional_learning_manager_info, params: { id: admin_for_vitally.reload.id }
          expect(response).to be_successful
          expect(response.body).to eq(vitally_district['keyRoles'].first['vitallyUser'].to_json)
        end
      end

      context 'when the user belongs to a school' do
        before do
          allow(api_stub).to receive(:get)
          .with(VitallyIntegration::RestApi::ENDPOINT_ORGANIZATIONS, anything)
          .and_return(vitally_district)
        end

        it 'retrieves professional learning manager info and renders it as json' do
          district = create(:district)
          school = create(:school, district_id: district.id)
          create(:schools_users, user: admin_for_vitally, school: school)
          get :vitally_professional_learning_manager_info, params: { id: admin_for_vitally.reload.id }
          expect(response).to be_successful
          expect(response.body).to eq(vitally_district['keyRoles'].first['vitallyUser'].to_json)
        end
      end
    end

    context 'when no district is associated with the user' do
      before do
        school_with_no_district = create(:school, district_id: nil)
        allow(admin_for_vitally).to receive(:administered_districts).and_return([])
        allow(admin_for_vitally).to receive(:administered_schools).and_return([school_with_no_district])
        allow(admin_for_vitally).to receive(:school).and_return(school_with_no_district)
      end

      it 'renders nil' do
        get :vitally_professional_learning_manager_info, params: { id: admin_for_vitally.id }
        expect(response).to be_successful
        expect(response.body).to eq('null')
      end
    end

    context 'when no professional learning manager is found' do
      let(:vitally_district) { { 'keyRoles' => [] } }

      before do
        allow(admin_for_vitally).to receive(:administered_districts).and_return([double(id: 1)])
        allow(api_stub).to receive(:get)
          .with(VitallyIntegration::RestApi::ENDPOINT_ORGANIZATIONS, anything)
          .and_return(vitally_district)
      end

      it 'renders nil' do
        get :vitally_professional_learning_manager_info, params: { id: admin_for_vitally.id }
        expect(response).to be_successful
        expect(response.body).to eq('null')
      end
    end
  end

end
