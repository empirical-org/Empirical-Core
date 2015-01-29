require 'rails_helper'

describe SessionsController, :type => :controller do
  before do
    User.create(email: 'student@quill.org',
                username: 'student1',
                password: '12345',
                password_confirmation: '12345',
                role: 'student')
  end

  describe 'create with valid attributes' do
    before do
      post :create, user: {email: 'Student@quill.org', password: '12345'}
    end

    it { is_expected.to redirect_to profile_path }
  end

  describe 'create with invalid attributes' do
    before do
      post :create, user: {email: 'Student@quill.org', password: 'wrong'}
    end

    it { is_expected.not_to redirect_to profile_path }
  end
end
