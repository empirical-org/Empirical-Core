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

    before { allow(RawSqlRunner).to receive(:execute) { [district_hash] } }

    it 'should allows staff memeber to view and search through district' do
      get :index
      expect(assigns(:district_search_query)).to eq({})
      expect(assigns(:district_search_query_results)).to eq []
      expect(assigns(:number_of_pages)).to eq 0
    end
  end

  describe '#search' do
    let(:district_hash) { {district_zip: "1234", district_name: 'Test District', district_city: 'Test City'} }
    let!(:district) { create(:district, name: "Test District") }

    before { allow(RawSqlRunner).to receive(:execute).and_return([district_hash]) }

    it 'should search for the district and give the results' do
      get :search, params: {:district_name => 'test'}
      expect(response.body).to eq({numberOfPages: 0, districtSearchQueryResults: [district_hash]}.to_json)
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

  describe '#add_admin_by_email' do
    let!(:another_user) { create(:user) }
    let!(:district) { create(:district) }

    it 'should create the districts admin and redirect to cms district path' do
      post :add_admin_by_email, params: { email_address: another_user.email, id: district.id }
      expect(flash[:success]).to eq "Yay! It worked! 🎉"
      expect(response).to redirect_to cms_district_path(district.id)
      expect(DistrictAdmin.last.user).to eq another_user
      expect(DistrictAdmin.last.district).to eq district
    end
  end

  describe '#remove_admin' do
    let!(:district) { create(:district)}
    let!(:another_user) { create(:user)}
    let!(:district_admins) { create(:district_admin, district: district, user: another_user)}

    it 'should remove the admin relationship and redirect to cms district path' do
      expect(DistrictAdmin.find_by(user: another_user.id, district: district)).to be
      post :remove_admin, params: { id: district.id, user_id: another_user.id, district_id: district.id }
      expect(flash[:success]).to eq 'Success! 🎉'
      expect(response).to redirect_to cms_district_path(district.id)
      expect(DistrictAdmin.find_by(user: another_user.id, district: district)).not_to be
      expect(another_user.reload.administered_districts).to eq []
    end
  end
end
