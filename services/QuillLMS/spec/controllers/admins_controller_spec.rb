# frozen_string_literal: true

require 'rails_helper'

describe AdminsController  do
  before { allow(controller).to receive(:current_user) { user } }

  it { should use_before_action :admin! }
  it { should use_before_action :set_teacher }
  it { should use_before_action :admin_of_this_teacher! }
  it { should use_before_action :sign_in }

  let(:user) { create(:admin) }
  let!(:teacher) { create(:teacher_with_school) }
  let!(:schools_admins) { create(:schools_admins, school: teacher.reload.school, user: user) }


  describe '#show' do
    before { allow(UserAdminSerializer).to receive(:new) { "some json" } }

    it 'should render the correct json' do
      get :show, params: { id: teacher.id }
      expect(response.body).to eq(({id: user.id}).to_json)
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
end
