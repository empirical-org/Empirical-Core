# frozen_string_literal: true

require 'rails_helper'

describe SchoolsUsersController do
  let(:user) { create(:user) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#school_for_current_user' do
    it 'returns the school and its admins if the user has one associated' do
      schools_users = create(:schools_users, user: user)
      schools_admins = create(:schools_admins, school: schools_users.school)

      user.reload

      get :school_for_current_user
      expect(JSON.parse(response.body)['school']['id']).to eq(schools_users.school_id)
      expect(JSON.parse(response.body)['admins'][0]['id']).to eq(schools_admins.user.id)
    end

    it 'returns nil if the user has no school' do
      get :school_for_current_user
      expect(JSON.parse(response.body)['school']).to eq(nil)
      expect(JSON.parse(response.body)['admins']).to eq(nil)
    end
  end
end
