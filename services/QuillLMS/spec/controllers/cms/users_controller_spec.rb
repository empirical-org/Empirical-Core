require 'rails_helper'

describe Cms::UsersController do
  it { should use_before_filter :signed_in! }
  it { should use_before_action :set_flags }
  it { should use_before_action :set_user }
  it { should use_before_action :set_search_inputs }
  it { should use_before_action :subscription_data }
  it { should use_before_action :filter_zeroes_from_checkboxes }

  let!(:user) { create(:staff) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#index' do
    before do
      allow(ActiveRecord::Base.connection).to receive(:execute) { ["results"] }
    end

    it 'should assign the search query, the results, user flags and number of spaces' do
      get :index
      expect(assigns(:user_search_query)).to eq({sort: 'last_sign_in', sort_direction: 'desc'})
      expect(assigns(:user_search_query_results)).to eq []
      expect(assigns(:user_flags)).to eq User::VALID_FLAGS
      expect(ChangeLog.last.action).to eq(ChangeLog::USER_ACTIONS[:index])
    end
  end

  describe '#search' do
    before do
      allow(ActiveRecord::Base.connection).to receive(:execute).and_return(["results"])
    end

    it 'should search for the users' do
      get :search, user_flag: "auditor"
      expect(response.body).to eq({numberOfPages: 0, userSearchQueryResults: ["results"], userSearchQuery: {user_flag: "auditor"}}.to_json)
      expect(ChangeLog.last.action).to eq(ChangeLog::USER_ACTIONS[:search])
      expect(ChangeLog.last.explanation).to include('auditor')
    end
  end

  describe '#create_with_school' do
    let(:new_user) { build(:user) }
    let!(:school) { create(:school) }

    it 'should create the school users and kick of the syn sales contact worker' do
      post :create_with_school, user: new_user.attributes.merge({password: "test123"}), school_id: school.id
      expect(SchoolsUsers.last.school_id).to eq school.id
      expect(response).to redirect_to cms_school_path(school.id)
    end
  end

  # there is no route for this action, not sure if its used
  # describe '#show_json' do
  #   let!(:another_user) { create(:user) }
  #
  #   it 'should give the correct json' do
  #     get :show_json, format: :json
  #     expect(JSON.parse(response.body)).to eq(another_user.generate_teacher_account_info)
  #   end
  # end

  describe 'show' do
    let(:another_user) { create(:user) }

    it 'should log when an admin visit the user admin page' do
      get :show, id: another_user.id
      expect(ChangeLog.last.action).to eq(ChangeLog::USER_ACTIONS[:show])
      expect(ChangeLog.last.changed_record_id).to eq(another_user.id)
    end
  end

  describe 'create' do
    let(:new_user) { build(:user) }

    it 'should create the user with the given params' do
      post :create, user: new_user.attributes.merge({password: "test123"})
      expect(response).to redirect_to cms_users_path
      expect(User.last.email).to eq new_user.email
      expect(User.last.role).to eq new_user.role
    end
  end

  describe '#sign_in' do
    let(:another_user) { create(:user) }

    it 'should set the user id in session' do
      put :sign_in, id: another_user.id
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
      put :make_admin, school_id: school.id, user_id: non_admin.id
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
      put :remove_admin, user_id: admin.id, school_id: school.id
      expect{SchoolsAdmins.find(schools_admin.id)}.to raise_exception ActiveRecord::RecordNotFound
      expect(response).to redirect_to "http://example.com"
    end
  end

  describe '#edit' do
    let!(:another_user) { create(:user) }
    it 'should log when admin visits the edit page' do
      get :edit, id: another_user.id
      expect(ChangeLog.last.action).to eq(ChangeLog::USER_ACTIONS[:edit])
      expect(ChangeLog.last.changed_record_id).to eq(another_user.id)
    end
  end

  describe '#edit_subscription' do
    let!(:another_user) { create(:user) }

    it 'should assign the subscription' do
      get :edit_subscription, id: another_user.id
      expect(assigns(:subscription)).to eq another_user.subscription
    end
  end

  describe '#new_subscription' do
    let!(:another_user) { create(:user) }
    let!(:subscription) { create(:subscription)}
    let!(:user_subscription) { create(:user_subscription, user: another_user, subscription: subscription) }

    it 'should create a new subscription with starting after the current subscription ends' do
      get :new_subscription, id: another_user.id
      expect(assigns(:subscription).start_date).to eq subscription.expiration
      expect(assigns(:subscription).expiration).to eq subscription.expiration + 1.year
    end
  end

  describe '#update' do
    let!(:another_user) { create(:user) }

    it 'should update the attributes for the given user and update change_log' do
      post :update, id: another_user.id, user: { email: "new@test.com", flags: ["purchaser"] }
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
      put :clear_data, id: another_user.id
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
      post :complete_sales_stage, id: another_user.id, stage_number: 2
      expect(flash[:success]).to eq "Stage marked completed"
      expect(response).to redirect_to cms_user_path(another_user.id)
    end
  end
end
