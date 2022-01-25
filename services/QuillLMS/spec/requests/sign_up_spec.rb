# frozen_string_literal: true

require 'rails_helper'

describe 'Sign up', type: :request do

  def sign_up_succeeds
    expect(response.status).to eq(200)
  end

  def sign_up_fails
    expect(response.status).to_not eq(200)
  end

  describe 'Create New Teacher Account' do
    it 'requires unique email' do
      post '/account', params: { user: user_params }
      sign_up_succeeds

      post '/account', params: { user: user_params }
      sign_up_fails
      expect(JSON.parse(response.body)['errors']['email']).to include("That email is taken. Try another.")
    end
  end

  describe 'Create New Student Account (from sign up)' do
    it 'requires unique username' do
      post '/account', params: { user: user_params(username: 'TestStudent', role: 'student') }
      sign_up_succeeds

      post '/account', params: { user: user_params(username: 'TestStudent', role: 'student') }
      sign_up_fails
      expect(JSON.parse(response.body)['errors']['username']).to include("That username is taken. Try another.")
    end

    it 'does not require email' do
      post '/account', params: { user: user_params(username: 'TestStudent', role: 'student').except(:email) }
      sign_up_succeeds
    end
  end

  # FIXME: below no longer works since profile is now in React
  # describe 'Connect Student account to teacher account via class-code' do
  #   # TODO: should be moved to a feature spec? doing everything short of using capybara API.
  #   #       replace with session stubbing.
  #   it 'allows them to fill in a classcode' do
  #     create(:section)
  #     classroom = create(:classroom)
  #     post '/account', user: user_params(username: 'TestStudent', role: 'student')

  #     put '/profile', user: { classcode: classroom.code }
  #     follow_redirect!

  #     expect(response.body).to include(classroom.name)
  #   end
  # end

  describe 'Create New Student Account (from teacher interface)' do
    let(:classroom)                 { create(:classroom) }
    let(:teacher)                   { classroom.owner }
    let(:student)                   { build(:student) }

    let(:student_first_name)        { student.first_name }
    let(:student_last_name)         { student.last_name }

    let(:expected_student_email)    { "#{student_first_name}.#{student_last_name}@#{classroom.code}".downcase }
    let(:expected_student_password) { student_last_name.capitalize }

    before do
      password = 'password'
      teacher.update(password: password)
      sign_in(teacher.email, teacher.password)
    end

    context "when the teacher enters the student's name correctly" do
      before do
        post teachers_classroom_students_path(classroom), params: { user: {first_name: student_first_name, last_name: student_last_name} }
      end

      it 'generates password' do
        user = User.find_by_username_or_email(expected_student_email)
        expect(user.authenticate(expected_student_password)).to be_truthy
      end

      it 'generates username' do
        expect(response.body).to include(student_first_name.capitalize)
        expect(response.body).to include(student_last_name.capitalize)
        expect(response.body).to include(expected_student_email)
      end

      it 'allows student to sign in' do
        sign_in(expected_student_email, expected_student_password)
        expect(response).to redirect_to(profile_path)
        expect(User.find(session[:user_id])).to_not eq(nil)
      end

      it "creates an association between the student and the teacher's classroom" do
        expect(User.find_by_username_or_email(expected_student_email).classrooms).to include(classroom)
      end

    end
  end
end
