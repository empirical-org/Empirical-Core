# frozen_string_literal: true

require 'rails_helper'

describe GoogleIntegration::User do
  describe '#update_or_initialize' do

    before do
      allow_any_instance_of(GoogleIntegration::Profile).to receive(:access_token).and_return('whatever')
      allow_any_instance_of(GoogleIntegration::Profile).to receive(:refresh_token).and_return('whatever')
      allow_any_instance_of(GoogleIntegration::Profile).to receive(:expires_at).and_return('the future')
    end

    let!(:teacher) { create(:teacher, google_id: 234)}

    it 'returns a user with the passed-in role if initializing a new user' do
      @profile1 = GoogleIntegration::Profile.new({}, {})

      allow_any_instance_of(GoogleIntegration::Profile).to receive(:name).and_return('Jane Smith')
      allow_any_instance_of(GoogleIntegration::Profile).to receive(:email).and_return('janesmith@google.com')
      allow_any_instance_of(GoogleIntegration::Profile).to receive(:google_id).and_return(123)
      allow_any_instance_of(GoogleIntegration::Profile).to receive(:role).and_return('student')
      user = GoogleIntegration::User.new(@profile1).update_or_initialize
      expect(user.role).to eq('student')
    end

    it 'returns a user with their existing role if the user already exists' do
      @profile2 = GoogleIntegration::Profile.new({}, {})

      allow_any_instance_of(GoogleIntegration::Profile).to receive(:name).and_return(teacher.name)
      allow_any_instance_of(GoogleIntegration::Profile).to receive(:email).and_return(teacher.email)
      allow_any_instance_of(GoogleIntegration::Profile).to receive(:google_id).and_return(teacher.google_id)
      allow_any_instance_of(GoogleIntegration::Profile).to receive(:role).and_return('student')

      user = GoogleIntegration::User.new(@profile2).update_or_initialize
      expect(user.role).to eq('teacher')
    end
  end
end
