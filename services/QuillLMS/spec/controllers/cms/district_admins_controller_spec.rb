# frozen_string_literal: true

require 'rails_helper'

describe Cms::DistrictAdminsController do
  let(:user) { create(:staff) }
  let!(:district1) { create(:district) }
  let!(:district2) { create(:district) }
  let!(:admin) { create(:user) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#create' do
    it 'creates a new user account and district admin for a new user, and sends the expected email' do
      post :create, params: { district_id: district1.id, email: 'test@email.com', first_name: 'Test', last_name: 'User' }

      new_user = User.find_by(email: 'test@email.com')
      expect(new_user).to be
      expect(DistrictAdmin.find_by_user_id(new_user.id)).to be
      expect(ActionMailer::Base.deliveries.last.subject).to eq('[Action Required] Test, a Quill district admin account was created for you')
      expect(ActionMailer::Base.deliveries.last.to).to eq(['test@email.com'])
    end

    it 'creates a new district admin for an existing user and sends the expected email' do
      post :create, params: { district_id: district2.id, email: admin.email}

      expect(DistrictAdmin.find_by_user_id(admin.id)).to be
      expect(ActionMailer::Base.deliveries.last.subject).to eq("#{admin.first_name}, you are now a Quill admin for #{district2.name}")
      expect(ActionMailer::Base.deliveries.last.to).to eq([admin.email])
    end

    it 'does not create a new district admin if one already exists' do
      create(:district_admin, district: district1, user: admin)
      expect(DistrictAdmin.count).to eq(1)

      post :create, params: { district_id: district1.id, email: admin.email}

      expect(DistrictAdmin.count).to eq(1)
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
