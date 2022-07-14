# frozen_string_literal: true

require 'rails_helper'

describe Cms::DistrictsController do
  let(:user) { create(:staff) }

  before { allow(controller).to receive(:current_user) { user } }

  it { should use_before_action :text_search_inputs }
  it { should use_before_action :set_district }

  describe "DISTRICTS_PER_PAGE" do
    it 'should have the correct value' do
      expect(described_class::DISTRICTS_PER_PAGE).to eq 30.0
    end
  end

  describe '#index' do
    let(:district_hash) { {district_zip: "1234", district_name: 'Test District', district_city: 'Test City'} }

    it 'should allows staff memeber to view and search through district' do
      get :index
      expect(assigns(:district_search_query)).to eq({})
      expect(assigns(:district_search_query_results)).to eq []
      expect(assigns(:number_of_pages)).to eq 0
    end
  end

  describe '#search' do
    let!(:district) { create(:district, name: "Test District") }
    let(:district_hash) { {id: district.id, name: district.name, nces_id: district.nces_id, city: district.city, state: district.state, zipcode: district.zipcode, phone: district.phone, total_students: district.total_students, total_schools: district.total_schools } }

    it 'should search for the district and give the results' do
      get :search, params: {:district_name => 'test'}
      expect(response.body).to eq({numberOfPages: 1, districtSearchQueryResults: [district_hash]}.to_json)
    end
  end

  describe '#show' do
    let!(:district) { create(:district) }

    it 'should assign the correct values' do
      get :show, params: { id: district.id }
      expect(assigns(:district)).to eq(district)
      expect(assigns(:school_data)).to eq([])
      expect(assigns(:admins)).to eq(DistrictAdmin.includes(:user).where(district_id: district.id).map do |admin|
        {
            name: admin.user.name,
            email: admin.user.email,
            district_id: admin.district_id,
            user_id: admin.user_id
        }
      end
      )
    end
  end

  describe '#edit' do
    let!(:district) { create(:district) }

    it 'should assign the district and editable attributes' do
      get :edit, params: { id: district.id }
      expect(assigns(:district)).to eq district
      expect(assigns(:editable_attributes)).to eq({
          'District Name' => :name,
          'District City' => :city,
          'District State' => :state,
          'District ZIP' => :zipcode,
          'District Phone' => :phone,
          'NCES ID' => :nces_id,
          'Clever ID' => :clever_id,
          'Total Schools' => :total_schools,
          'Total Students' => :total_students,
          'Grade Range' => :grade_range
      })
    end
  end

  describe '#update' do
    let!(:district) { create(:district) }

    it 'should update the given district' do
      post :update, params: { id: district.id, district: { id: district.id, name: "test name" } }
      expect(district.reload.name).to eq "test name"
      expect(response).to redirect_to cms_district_path(district.id)
    end
  end

  describe '#new_admin' do
    let!(:district) { create(:district) }

    it 'should assign the district' do
      get :new_admin, params: { id: district.id }
      expect(assigns(:district)).to eq district
    end
  end

  describe '#edit_subscription' do
    let!(:district) { create(:district_subscription).district }

    it 'should assign the subscription' do
      get :edit_subscription, params: { id: district.id }

      expect(assigns(:subscription)).to eq district.subscription
    end
  end

  describe '#new_subscription' do
    let!(:district) { create(:district) }
    let!(:subscription) { create(:subscription)}
    let!(:district_subscription) { create(:district_subscription, district: district, subscription: subscription) }
    let!(:district_with_no_subscription) { create(:district) }

    describe 'when there is no existing subscription' do
      it 'should create a new subscription that starts today and ends at the promotional expiration date' do
        get :new_subscription, params: { id: district_with_no_subscription.id }
        expect(assigns(:subscription).start_date).to eq Date.current
        expect(assigns(:subscription).expiration).to eq Subscription.promotional_dates[:expiration]
      end
    end

    describe 'when there is an existing subscription' do
      it 'should create a new subscription with starting after the current subscription ends' do
        get :new_subscription, params: { id: district.id }
        expect(assigns(:subscription).start_date).to eq subscription.expiration
        expect(assigns(:subscription).expiration).to eq subscription.expiration + 1.year
      end
    end
  end
end
