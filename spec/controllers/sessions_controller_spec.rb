require 'rails_helper'

describe SessionsController, type: :controller do
  before do
    User.create(email: 'student@quill.org',
                name: 'John Smith',
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

  describe 'login_through_ajax with valid attributes' do
    before do
      post :login_through_ajax, user: {email: 'Student@quill.org', password: '12345'}
    end

    it "returns a redirect route" do
      expect(JSON.parse(response.body)).to eq({"redirect" => '/'})
    end
  end

  describe 'login_through_ajax with invalid attributes' do
    before do
      post :login_through_ajax, user: {email: 'Student@quill.org', password: 'wrong'}
    end

    it { is_expected.not_to redirect_to profile_path }
    it "returns an unauthorized message" do
        expect(response.message).to eq('Unauthorized')
    end
  end
end
