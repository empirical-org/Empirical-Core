require 'spec_helper'

describe SessionsController do
  before do
    @user = User.create(email: 'student@quill.org',
                        username: 'student1',
                        password: '12345',
                        password_confirmation: '12345',
                        role: 'student')
  end

  describe 'POST create' do
    describe 'with valid attributes' do
      before do
        post :create, user: {email: 'Student@quill.org', password: '12345'}
      end

      it { should redirect_to profile_path }
    end
    describe 'with invalid attributes' do
      before do
        post :create, user: {email: 'Student@quill.org', password: 'wrong'}
      end

      it { should_not redirect_to profile_path }
      it { should render_template :new }
    end
  end

  describe 'DELETE destroy' do
    before do
      sign_in @user
      delete :destroy
    end

    it { should redirect_to root_path }
    it { should set_the_flash.to 'Logged Out' }
  end

  describe 'GET new' do
    before { get :new }

    it { should respond_with :success }
    it 'should assign @user as a new user' do
      assigns(:user).should be_a_new User
    end
  end
end