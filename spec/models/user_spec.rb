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

  it 'can set a first and last name' do
    expect(User.new(first_name: 'John').name).to eq('John')
    expect(User.new(last_name: 'Doe').name).to eq('Doe')
    expect(User.new(first_name: 'John', last_name: 'Doe').name).to eq('John Doe')
  end

  it 'requires email if a teacher' do
    expect(User.new(role: 'teacher')).to have(1).error_on(:email)
  end

  it 'requires email if no username present' do
    expect(User.new).to have(1).error_on(:email)
  end

  it 'is ok with a username if not a teacher and presented with a username' do
    expect(User.new(username: 'john')).to have(0).errors_on(:email)
    expect(User.new(username: 'john', role: 'teacher')).to have(1).error_on(:email)
  end

  context('#generate_student') do
    let(:classroom) { Classroom.new(code: '101') }

    subject do
      student = classroom.students.build(first_name: 'John', last_name: 'Doe')
      student.generate_student
      student
    end

    its(:username) { should eq('John.Doe@101') }
    its(:role) { should eq('student') }

    it 'should authenticate with last name' do
      expect(subject.authenticate('Doe')).to be_true
    end
  end

  #   it 'generates a username' do
  #     classroom = Classroom.new(code: '101')
  #     user = classroom.students.build(first_name: 'John', last_name: 'Doe')
  #     expect(user.generate_username).to eq('John.Doe@101')
  #   end

  #   it 'generates a password as last name' do
  #     classroom = Classroom.new(code: '101')
  #     user = classroom.students.build(first_name: 'John', last_name: 'Doe')
  #     expect(user.generate_username).to eq('John.Doe@101')
  #   end

  #   it 'sets the role' do

  #   end
  # end

  it 'checks for a password confirmation only when a password is present on update'
  it 'only requires a password on create'
  it 'doesn\'t care about all the validation stuff when the user is temporary'
  it 'disallows regular assignment of roles that are restricted'
end
