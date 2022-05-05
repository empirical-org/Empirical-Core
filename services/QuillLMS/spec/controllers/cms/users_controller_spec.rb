# frozen_string_literal: true

require 'rails_helper'

describe Cms::UsersController do
  let!(:user) { create(:staff) }

  before { allow(controller).to receive(:current_user) { user } }

  it { should use_before_action :signed_in! }
  it { should use_before_action :set_flags }
  it { should use_before_action :set_user }
  it { should use_before_action :set_search_inputs }
  it { should use_before_action :subscription_data }
  it { should use_before_action :filter_zeroes_from_checkboxes }

  describe '#index' do
    before { allow(RawSqlRunner).to receive(:execute) { ["results"] } }

    it 'should assign the search query, the results, user flags and number of spaces' do
      get :index
      expect(assigns(:user_search_query)).to eq({sort: 'last_sign_in', sort_direction: 'desc'})
      expect(assigns(:user_search_query_results)).to eq []
      expect(assigns(:user_flags)).to eq User::VALID_FLAGS
      expect(ChangeLog.last.action).to eq(ChangeLog::USER_ACTIONS[:index])
    end
  end

  describe '#search' do

    it 'should search for the users with user_flag' do
      get :search, params: { user_flag: "auditor" }
      expect(response.body).to eq({numberOfPages: 0, userSearchQueryResults: [], userSearchQuery: {user_flag: "auditor"}}.to_json)
      expect(ChangeLog.last.action).to eq(ChangeLog::USER_ACTIONS[:search])
      expect(ChangeLog.last.explanation).to include('auditor')
    end

    context 'email search' do
      let!(:search_user) {create(:user, email: 'test@testerson.com')}

      it 'should exact search a lower, trimmed version of email exact' do
        post :search, params: { user_email_exact: '  Test@teStErson.CoM  '}, as: :json

        json = JSON.parse(response.body)

        expect(json['userSearchQueryResults'].count).to be 1
        expect(json['userSearchQueryResults'].first['id']).to eq(search_user.id)
      end

      it 'should NOT return results for partial email exact search' do
        post :search, params: { user_email_exact: '@testerson.com' }, as: :json

        json = JSON.parse(response.body)

        expect(json['userSearchQueryResults']).to be_empty
      end

      it 'should return results for partial email non-exact search' do
        post :search, params: { user_email: '@testerson.com' }, as: :json

        json = JSON.parse(response.body)

        expect(json['userSearchQueryResults'].count).to be 1
        expect(json['userSearchQueryResults'].first['id']).to eq(search_user.id)
      end
    end

    it 'should search for the users with class_code' do
      teacher = create(:teacher_with_one_classroom, email: 'test@t.org')
      classroom = teacher.classrooms_i_teach.first
      classroom.teachers = [teacher]
      student = create(:student, classrooms: [classroom])
      class_code = classroom.code
      get :search, params: { class_code: class_code }
      expect(JSON.parse(response.body)).to eq(
        {
          "numberOfPages"=> 1,
          "userSearchQueryResults"=> [
            {
              "name"=> teacher.name,
              "email"=> teacher.email,
              "role"=> teacher.role,
              "last_sign_in"=> nil,
              "subscription"=> nil,
              "last_sign_in_text" => nil,
              "school"=> nil,
              "school_id"=> nil,
              "id"=> teacher.id
            },
            {
              "name" => student.name,
              "email" => student.email,
              "role" => student.role,
              "last_sign_in" => nil,
              "subscription" => nil,
              "last_sign_in_text" => nil,
              "school" => nil,
              "school_id" => nil,
              "id" => student.id
            }
          ],
          "userSearchQuery"=> {
            "class_code"=> class_code
          }
        })
      expect(ChangeLog.last.action).to eq(ChangeLog::USER_ACTIONS[:search])
      expect(ChangeLog.last.explanation).to include('class_code')
    end
  end

  describe '#create_with_school' do
    let(:new_user) { build(:user) }
    let!(:school) { create(:school) }

    it 'should create the school users and kick of the syn sales contact worker' do
      post :create_with_school, params: { user: new_user.attributes.merge({password: "test123"}), school_id: school.id }
      expect(SchoolsUsers.last.school_id).to eq school.id
      expect(response).to redirect_to cms_school_path(school.id)
    end
  end

  describe 'show' do
    let(:another_user) { create(:user) }

    it 'should log when an admin visit the user admin page' do
      get :show, params: { id: another_user.id }
      expect(ChangeLog.last.action).to eq(ChangeLog::USER_ACTIONS[:show])
      expect(ChangeLog.last.changed_record_id).to eq(another_user.id)
    end
  end

  describe 'create' do
    let(:new_user) { build(:user) }

    it 'should create the user with the given params' do
      post :create, params: { user: new_user.attributes.merge({password: "test123"}) }
      expect(response).to redirect_to cms_users_path
      expect(User.last.email).to eq new_user.email
      expect(User.last.role).to eq new_user.role
    end
  end

  describe '#sign_in' do
    let(:another_user) { create(:user) }

    it 'should set the user id in session' do
      put :sign_in, params: { id: another_user.id }
      expect(session[:staff_id]).to eq user.id
      expect(ChangeLog.last.action).to eq(ChangeLog::USER_ACTIONS[:sign_in])
      expect(ChangeLog.last.changed_record_id).to eq(another_user.id)
    end
  end

  describe '#make_admin' do
    let!(:school) { create(:school) }
    let!(:non_admin) { create(:user) }

    before do
      request.env['HTTP_REFERER'] = 'http://example.com'
    end

    it 'should create a new schoolsadmin for the user given' do
      put :make_admin, params: { school_id: school.id, user_id: non_admin.id }
      expect(SchoolsAdmins.last.school_id).to eq school.id
      expect(SchoolsAdmins.last.user_id).to eq non_admin.id
      expect(response).to redirect_to 'http://example.com'
    end
  end

  describe '#remove_admin' do
    let!(:school) { create(:school) }
    let!(:admin) { create(:user) }
    let!(:schools_admin) { create(:schools_admins, user_id: admin.id, school_id: school.id) }

    before do
      request.env['HTTP_REFERER'] = 'http://example.com'
    end

    it 'should destroy the schoolsadmins' do
      put :remove_admin, params: { user_id: admin.id, school_id: school.id }
      expect{SchoolsAdmins.find(schools_admin.id)}.to raise_exception ActiveRecord::RecordNotFound
      expect(response).to redirect_to "http://example.com"
    end
  end

  describe '#edit' do
    let!(:another_user) { create(:user) }

    it 'should log when admin visits the edit page' do
      get :edit, params: { id: another_user.id }
      expect(ChangeLog.last.action).to eq(ChangeLog::USER_ACTIONS[:edit])
      expect(ChangeLog.last.changed_record_id).to eq(another_user.id)
    end
  end

  describe '#edit_subscription' do
    let!(:another_user) { create(:user) }

    it 'should assign the subscription' do
      get :edit_subscription, params: { id: another_user.id }
      expect(assigns(:subscription)).to eq another_user.subscription
    end
  end

  describe '#new_subscription' do
    let!(:another_user) { create(:user) }
    let!(:user_with_no_subscription) { create(:user) }
    let!(:subscription) { create(:subscription)}
    let!(:user_subscription) { create(:user_subscription, user: another_user, subscription: subscription) }

    describe 'when there is no existing subscription' do
      let(:today) { Date.current }

      it 'should create a new subscription that starts today and ends exactly 1 year later' do
        get :new_subscription, params: { id: user_with_no_subscription.id }
        expect(assigns(:subscription).start_date).to eq today
        expect(assigns(:subscription).expiration).to eq today + 1.year
      end
    end

    describe 'when there is an existing subscription' do
      it 'should create a new subscription with starting after the current subscription ends' do
        get :new_subscription, params: { id: another_user.id }
        expect(assigns(:subscription).start_date).to eq subscription.expiration
        expect(assigns(:subscription).expiration).to eq subscription.expiration + 1.year
      end
    end
  end

  describe '#update' do
    let!(:another_user) { create(:user) }

    it 'should update the attributes for the given user and update change_log' do
      post :update, params: { id: another_user.id, user: { email: "new@test.com", flags: ["purchaser"] } }
      expect(another_user.reload.email).to eq "new@test.com"
      expect(response).to redirect_to cms_users_path
      expect(ChangeLog.last.action).to eq(ChangeLog::USER_ACTIONS[:update])
      expect(ChangeLog.last.changed_attribute).to eq('flags')
      expect(ChangeLog.last.new_value).to include('purchaser')
    end
  end

  describe '#clear_data' do
    let!(:another_user) { create(:user) }

    it 'should clear the data' do
      expect_any_instance_of(User).to receive(:clear_data)
      put :clear_data, params: { id: another_user.id }
      expect(response).to redirect_to cms_users_path
    end
  end

  # no route for this action
  # describe '#destroy' do
  #   let!(:another_user) { create(:user) }
  #
  #   it 'should destroy the given user' do
  #     delete :destoy, id: another_user.id
  #     expect{User.find another_user.id}.to raise_exception ActiveRecord::RecordNotFound
  #   end
  # end

  describe '#complete_sales_stage' do
    let!(:another_user) { create(:user) }
    let(:updater) { double(:updater, call: true) }

    before do
      allow(UpdateSalesContact).to receive(:new) { updater }
    end

    it 'should create the sales contact updater' do
      expect(UpdateSalesContact).to receive(:new).with(another_user.id, "2", user)
      expect(updater).to receive(:call)
      post :complete_sales_stage, params: { id: another_user.id, stage_number: 2 }
      expect(flash[:success]).to eq "Stage marked completed"
      expect(response).to redirect_to cms_user_path(another_user.id)
    end
  end
end
