# frozen_string_literal: true

require 'rails_helper'

describe 'Sign in', type: :request do
  before do
    User.create(email: 'student@quill.org',
                name: 'John Smith',
                username: 'student1',
                password: '12345',
                password_confirmation: '12345',
                role: 'student')
  end

  describe 'POST /session' do
    it 'creates with valid attributes' do
      post '/session', params: { user: {email: 'student@quill.org', password: '12345'} }
      expect(response).to redirect_to(profile_path)
    end

    it 'does not create with invalid attributes' do
      post '/session', params: { user: {email: 'student@quill.org', password: 'wrong'} }
      expect(response).to_not redirect_to(profile_path)
    end
  end
end
