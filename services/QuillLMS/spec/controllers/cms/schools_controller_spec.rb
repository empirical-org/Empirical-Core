# frozen_string_literal: true

require 'rails_helper'

describe Cms::SchoolsController do
  let(:user) { create(:staff) }

  before { allow(controller).to receive(:current_user) { user } }

  it { should use_before_action :signed_in! }
  it { should use_before_action :text_search_inputs }
  it { should use_before_action :set_school }
  it { should use_before_action :subscription_data }

  describe "SCHOOLS_PER_PAGE" do
    it 'should have the correct value' do
      expect(described_class::SCHOOLS_PER_PAGE).to eq 30.0
    end
  end

  describe '#index' do
    let(:school_hash) { {school_zip: "1234", number_teachers: 23, number_admins: 5, frl: "frl"} }

    before { allow(RawSqlRunner).to receive(:execute) { [school_hash] } }

    it 'should allows staff memeber to view and search through school' do
      get :index
      expect(assigns(:school_search_query)).to eq({'search_schools_with_zero_teachers' => true})
      expect(assigns(:school_search_query_results)).to eq []
      expect(assigns(:number_of_pages)).to eq 0
    end
  end

  describe '#search' do

    context 'when a school has an expired subscription and an active subscription' do
      it 'should only one record of that school, without duplicates' do
        school = create(:school)
        expired_sub = create(:subscription, expiration: 15.days.ago.to_date)
        active_sub = create(:subscription)
        create(:school_subscription, school: school, subscription: expired_sub)
        create(:school_subscription, school: school, subscription: active_sub)
        get :search, params: {:school_name => school.name, :search_schools_with_zero_teachers => true}
        expect(JSON.parse(response.body)['schoolSearchQueryResults'].size).to eq(1)
        expect(JSON.parse(response.body)['schoolSearchQueryResults'][0]["id"]).to eq(school.id)
      end
    end

    context 'when a school has never had a subscription' do
      it 'should search successfully for that school' do
        school = create(:school)
        get :search, params: {:school_name => school.name, :search_schools_with_zero_teachers => true}
        expect(JSON.parse(response.body)['schoolSearchQueryResults'].size).to eq(1)
        expect(JSON.parse(response.body)['schoolSearchQueryResults'][0]["id"]).to eq(school.id)
      end
    end

    context 'when a school has no subscription now, but had one in the past that has now expired' do
      it 'should search successfully for that school' do
        school = create(:school)
        expired_sub = create(:subscription, expiration: 15.days.ago.to_date)
        create(:school_subscription, school: school, subscription: expired_sub)
        get :search, params: {:school_name => school.name, :search_schools_with_zero_teachers => true}
        expect(JSON.parse(response.body)['schoolSearchQueryResults'].size).to eq(1)
        expect(JSON.parse(response.body)['schoolSearchQueryResults'][0]["id"]).to eq(school.id)
      end
    end

    context 'when a school has a de-activated subscription' do
      it 'should search successfully for that school' do
        school = create(:school)
        deactivated_sub = create(:subscription, de_activated_date: 15.days.ago.to_date)
        create(:school_subscription, school: school, subscription: deactivated_sub)
        get :search, params: {:school_name => school.name, :search_schools_with_zero_teachers => true}
        expect(JSON.parse(response.body)['schoolSearchQueryResults'].size).to eq(1)
        expect(JSON.parse(response.body)['schoolSearchQueryResults'][0]["id"]).to eq(school.id)
      end
    end
  end

  describe '#show' do
    let!(:district) { create(:district) }
    let!(:school) { create(:school, district: district) }

    it 'should assign the correct values' do
      allow_any_instance_of(Cms::TeacherSearchQuery).to receive(:run) { "teacher data" }
      get :show, params: { id: school.id }
      expect(assigns(:subscription)).to eq school.subscription
      expect(assigns(:school_subscription_info)).to eq({
       'School Premium Type' => school&.subscription&.account_type,
       'Expiration' => school&.subscription&.expiration&.strftime('%b %d, %Y')
      })
      expect(assigns(:school)).to eq({
       'Name' => school.name,
       'City' => school.city || school.mail_city,
       'State' => school.state || school.mail_state,
       'ZIP' => school.zipcode || school.mail_zipcode,
       'District' => school.district.name,
       'Free and Reduced Price Lunch' => "#{school.free_lunches}%",
       'NCES ID' => school.nces_id,
       'PPIN' => school.ppin,
       'Clever ID' => school.clever_id
      })
      expect(assigns(:teacher_data)).to eq "teacher data"
      expect(assigns(:admins)).to eq(SchoolsAdmins.includes(:user).where(school_id: school.id).map do |admin|
          {
              name: admin.user.name,
              email: admin.user.email,
              school_id: admin.school_id,
              user_id: admin.user_id
          }
        end
      )
    end
  end

  describe '#edit' do
    let!(:school) { create(:school) }

    it 'should assign the school and editable attributes' do
      get :edit, params: { id: school.id }
      expect(assigns(:school)).to eq school
      expect(assigns(:editable_text_attributes)).to eq({
          'School Name' => :name,
          'School City' => :city,
          'School State' => :state,
          'School ZIP' => :zipcode,
          'FRP Lunch' => :free_lunches,
          'NCES ID' => :nces_id,
          'Clever ID' => :clever_id
      })
    end
  end

  describe '#update' do
    let!(:school) { create(:school) }

    it 'should update the given school' do
      post :update, params: { id: school.id, school: { id: school.id, name: "test name" } }
      expect(school.reload.name).to eq "test name"
      expect(response).to redirect_to cms_school_path(school.id)
    end
  end

  describe '#create' do
    it 'should create the school with the given params' do
      post :create, params: { school: {
          name: "test",
          city: "test city",
          state: "test state",
          zipcode: "11000",
          free_lunches: 2
      } }
      expect(School.last.name).to eq "test"
      expect(School.last.city).to eq "test city"
      expect(School.last.state).to eq "test state"
      expect(School.last.zipcode).to eq "11000"
      expect(School.last.free_lunches).to eq 2
      expect(response).to redirect_to cms_school_path(School.last.id)
    end
  end

  describe '#edit_subscription' do
    let!(:school) { create(:school) }

    it 'should assing the subscription' do
      get :edit_subscription, params: { id: school.id }
      expect(assigns(:subscription)).to eq school.subscription
    end
  end

  describe '#new_subscription' do
    let!(:school) { create(:school) }
    let!(:school_with_no_subscription) { create(:school) }
    let!(:subscription) { create(:subscription)}
    let!(:school_subscription) { create(:school_subscription, school: school, subscription: subscription) }


    describe 'when there is no existing subscription' do
      it 'should create a new subscription that starts today and ends at the promotional expiration date' do
        get :new_subscription, params: { id: school_with_no_subscription.id }
        expect(assigns(:subscription).start_date).to eq Date.current
        expect(assigns(:subscription).expiration).to eq Subscription.promotional_dates[:expiration]
      end
    end

    describe 'when there is an existing subscription' do
      it 'should create a new subscription with starting after the current subscription ends' do
        get :new_subscription, params: { id: school.id }
        expect(assigns(:subscription).start_date).to eq subscription.expiration
        expect(assigns(:subscription).expiration).to eq subscription.expiration + 1.year
      end
    end
  end

  describe '#add_by_admin' do
    let!(:another_user) { create(:user) }
    let!(:school) { create(:school) }

    it 'should create the schools admin and redirect to cms school path' do
      post :add_admin_by_email, params: { email_address: another_user.email, id: school.id }
      expect(flash[:success]).to eq "Yay! It worked! 🎉"
      expect(response).to redirect_to cms_school_path(school.id)
      expect(SchoolsAdmins.last.user).to eq another_user
      expect(SchoolsAdmins.last.school).to eq school
    end
  end

  describe '#add_existing_user_by_email' do
    let!(:another_user) { create(:user, role: 'teacher') }
    let!(:school) { create(:school) }

    before do
      request.env['HTTP_REFERER'] = 'quill.org'
    end

    it 'should create the schools users and redirect to cms school path' do
      post :add_existing_user_by_email, params: { email_address: another_user.email, id: school.id }
      expect(flash[:success]).to eq "Yay! It worked! 🎉"
      expect(response).to redirect_to cms_school_path(school.id)
      expect(SchoolsUsers.last.user).to eq another_user
      expect(SchoolsUsers.last.school).to eq school
      expect(another_user.reload.school).to eq school
    end

    it 'should not create the schools users and redirect to cms school path if email is invalid' do
      post :add_existing_user_by_email, params: { email_address: 'random-invalid-email', id: school.id }
      expect(flash[:error]).to eq "It didn't work! Make sure the email you typed is correct."
    end
  end

  describe '#unlink' do
    let!(:school) { create(:school)}
    let!(:another_user) { create(:user, school: school)}

    before do
      request.env['HTTP_REFERER'] = cms_school_path(school.id)
    end

    it 'should unlink the user and redirect to cms school path' do
      expect(SchoolsUsers.find_by(user: another_user.id, school: school)).to be
      post :unlink, params: { teacher_id: another_user.id, id: school.id }
      expect(flash[:success]).to eq "Yay! It worked! 🎉"
      expect(response).to redirect_to cms_school_path(school.id)
      expect(SchoolsUsers.find_by(user: another_user.id, school: school)).not_to be
      expect(another_user.reload.school).to eq nil
    end
  end
end
