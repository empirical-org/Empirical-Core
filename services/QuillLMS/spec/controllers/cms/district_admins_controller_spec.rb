# frozen_string_literal: true

require 'rails_helper'

describe Cms::DistrictAdminsController do
  let(:user) { create(:staff) }
  let!(:district) { create(:district) }
  let!(:admin) { create(:user) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#create' do
    it 'creates a new district admin' do
      post :create, params: { district_id: district.id, email: admin.email}

      expect(DistrictAdmin.find_by_user_id(admin.id)).to be
    end

    it 'does not create a new district admin if one already exists' do
      create(:district_admin, district: district, user: admin)
      expect(DistrictAdmin.count).to eq(1)

      post :create, params: { district_id: district.id, email: admin.email}

      expect(DistrictAdmin.count).to eq(1)
    end
  end

  describe '#destroy' do
    it 'destroys the district admin' do
      create(:district_admin, district: district, user: admin)
      district_admin = DistrictAdmin.find_by_user_id(admin.id)

      delete :destroy, params: { district_id: district.id, id: district_admin.id}

      expect(DistrictAdmin.find_by_user_id(admin.id)).not_to be
    end
  end
end
