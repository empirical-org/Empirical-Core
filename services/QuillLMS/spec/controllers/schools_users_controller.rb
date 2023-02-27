# frozen_string_literal: true

require 'rails_helper'

describe SchoolsUsersController do
  let(:user) { create(:user) }

  before do
    allow(controller).to receive(:current_user) { user }
  end

  describe '#school_for_current_user' do
    it 'returns the school if the user has one associated' do
      schools_users = create(:schools_users, user: user)

      get :school_for_current_user
      expect(response.body.school.id).to eq(schools_users.school_id)
    end

    it 'returns nil if the user has no school' do
      get :school_for_current_user
      expect(response.body.school).to eq(nil)
    end
  end
end
