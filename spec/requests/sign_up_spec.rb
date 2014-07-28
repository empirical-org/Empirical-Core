require 'spec_helper'

describe 'Sign up', :type => :request do
  describe 'Create New Teacher Account' do
    it 'requires unique email' do
      post '/account', user: user_params
      expect(response).to redirect_to(profile_path)

      post '/account', user: user_params
      expect(response).to_not redirect_to(profile_path)
      expect(response.body).to include('Email has already been taken')
    end
  end

  describe 'Create New Student Account (from sign up)' do
    it 'requires unique username' do
      post '/account', user: user_params(username: 'TestStudent', role: 'student')
      expect(response).to redirect_to(profile_path)

      post '/account', user: user_params(username: 'TestStudent', role: 'student')
      expect(response).to_not redirect_to(profile_path)
      expect(response.body).to include('Username has already been taken')
    end

    it 'does not require email' do
      post '/account', user: user_params(username: 'TestStudent', role: 'student').except(:email)
      expect(response).to redirect_to(profile_path)
    end
  end

  describe 'Connect Student account to teacher account via class-code' do
    # TODO: should be moved to a feature spec? doing everything short of using capybara API.
    #       replace with session stubbing.
    it 'allows them to fill in a classcode' do
      classroom = create(:classroom)
      post '/account', user: user_params(username: 'TestStudent', role: 'student')
      follow_redirect!

      expect(response.body).to match(/input.*classcode/)

      put '/profile', user: { classcode: classroom.code }
      follow_redirect!

      expect(response.body).to include(classroom.name)
    end
  end

  describe 'Create New Student Account (from teacher interface)' do
    before do
      @classroom = create(:classroom)
      @teacher   = @classroom.teacher
      sign_in(@teacher.email, '123456')
      post teachers_classroom_students_path(@classroom), user: {first_name: 'Test', last_name: 'Student'}
      follow_redirect!
    end

    it 'generates password' do
      expect(User.authenticate(email: "Test.Student@#{@classroom.code}", password: 'Student')).to be_truthy
    end

    it 'generates username' do
      expect(response.body).to include('Test')
      expect(response.body).to include('Student')
      expect(response.body).to include("Test.Student@#{@classroom.code}")
    end

    it 'allows student to sign in' do
      sign_in("Test.Student@#{@classroom.code}", 'Student')
      expect(response).to redirect_to(profile_path)
      expect(User.find(session[:user_id]).classroom).to eq(@classroom)
    end

    it 'allows the teacher to accidentally enter the full name in the first name field' do
      post teachers_classroom_students_path(@classroom), user: {first_name: 'Full Name'}
      follow_redirect!

      expect(response.body).to include('Full')
      expect(response.body).to include('Name')
      expect(response.body).to include("Full.Name@#{@classroom.code}")
    end
  end
end
