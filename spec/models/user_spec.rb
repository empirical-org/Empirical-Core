require 'spec_helper'

describe User do
  it 'Can auth by user or email' do
    User.create(username: 'test',          password: '123456', password_confirmation: '123456')
    User.create(email: 'test@example.com', password: '654321', password_confirmation: '654321')

    expect(User.authenticate(email: 'test',             password: '123456')).to be_true
    expect(User.authenticate(email: 'test@example.com', password: '654321')).to be_true
  end

  describe 'requires email if user is teacher' do
    before do
      @teacher = User.create(username: 'teacher_test', 
                             password: 'password', 
                             password_confirmation: 'password',
                             role: 'teacher')
    end
    it 'teacher should not be valid' do
      @teacher.should_not be_valid
    end
  end

  describe 'requires email if no username is present' do
    describe 'teacher' do
      before do
        @teacher = User.create(password: 'password', 
                               password_confirmation: 'password',
                               role: 'teacher')
      end
      it 'teacher should not be valid' do
        @teacher.should_not be_valid
      end
    end

    describe 'student' do
      before do
        @student = User.create(password: 'password', 
                               password_confirmation: 'password',
                               role: 'student')
      end
      it 'student should not be valid' do
        @student.should_not be_valid
      end
    end
  end

  describe 'is valid if not a teacher and presented with a username' do
    before do
      @student = User.create(username: 'student_test',
                             password: 'password', 
                             password_confirmation: 'password',
                             role: 'student')
    end
    it 'student should not be valid' do
      @student.should be_valid
    end
  end
  
  it 'checks for a password confirmation only when a password is present on update'
  it 'only requires a password on create'
  it 'doesn\'t care about all the validation stuff when the user is temporary'
  it 'disallows regular assignment of roles that are restricted'
end