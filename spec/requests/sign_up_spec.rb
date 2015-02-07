require 'rails_helper'

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
      create(:section)
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
    let(:classroom)                 { create(:classroom) }
    let(:teacher)                   { classroom.teacher }

    let(:student_first_name)        { 'Test' }
    let(:student_last_name)         { 'Student' }

    let(:expected_student_email)    { "#{student_first_name}.#{student_last_name}@#{classroom.code}".downcase }
    let(:expected_student_password) { student_last_name }

    before(:each) { sign_in(teacher.email, '123456') }

    context "when the teacher enters the student's name correctly" do
      before do
        post teachers_classroom_students_path(classroom), user: {first_name: student_first_name, last_name: student_last_name}
        follow_redirect!
      end

      it 'generates password' do
        expect(User.authenticate(email: expected_student_email, password: expected_student_password)).to be_truthy
      end

      it 'generates username' do
        expect(response.body).to include(student_first_name)
        expect(response.body).to include(student_last_name)
        expect(response.body).to include(expected_student_email)
      end

      it 'allows student to sign in' do
        sign_in(expected_student_email, expected_student_password)
        expect(response).to redirect_to(profile_path)
        expect(User.find(session[:user_id]).classroom).to eq(classroom)
      end
    end
  end
end
