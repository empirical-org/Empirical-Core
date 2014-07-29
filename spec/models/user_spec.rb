require 'spec_helper'

describe User, :type => :model do

  let(:user) { FactoryGirl.build(:user) }

  context "user authentication" do
    it 'Can auth by user or email' do
      User.create(username: 'test',          password: '123456', password_confirmation: '123456')
      User.create(email: 'test@example.com', password: '654321', password_confirmation: '654321')

      expect(User.authenticate(email: 'test',             password: '123456')).to be_truthy
      expect(User.authenticate(email: 'test@example.com', password: '654321')).to be_truthy
    end
  end

  context "for all users" do
    let(:user) { FactoryGirl.build(:user) }

    describe "validations for email" do
      before do
        user.email = nil
        user.username = nil
      end

      it 'should be invalid without email or username' do
        expect(user).not_to be_valid
      end

      it 'requires email for no username' do
        expect(user.errors[:email]).not_to be_nil
      end
    end

  end


  context "behaving as a teacher" do

    describe 'requires email' do

      let!(:teacher) { FactoryGirl.build(:teacher, email: nil) }

      it 'requires email if a teacher' do
        expect(teacher).not_to be_valid
        expect(teacher.errors[:email]).not_to be_nil
      end

    end

  end


  context "behaving as a student" do

    describe 'when no username is present' do

      let!(:student) { FactoryGirl.build(:student, username: nil) }

      it 'should be valid' do
        expect(student).to be_valid
      end

      context 'when email also missing' do

        before do
          student.email = nil
        end

        it 'should be invalid' do
          expect(student).not_to be_valid
        end

        it 'should have errors on the email attr' do
          expect(student.errors[:email]).not_to be_nil
        end

      end

    end

  end

  context "#name attribute" do

    it "has a first_name only" do
      user.last_name = nil
      expect(user.name).to eq('Test')
    end

    it "has a last name only" do
      user.first_name = nil
      expect(user.name).to eq('User')
    end

    it "has a full name" do
      expect(user.name).to eq('Test User')
    end

  end

  context('#generate_student') do
    let(:classroom) { Classroom.new(code: '101') }

    subject do
      student = classroom.students.build(first_name: 'John', last_name: 'Doe')
      student.generate_student
      student
    end

    describe '#username' do
      subject { super().username }
      it { is_expected.to eq('John.Doe@101') }
    end

    describe '#role' do
      subject { super().role }
      it { is_expected.to eq('student') }
    end

    it 'should authenticate with last name' do
      expect(subject.authenticate('Doe')).to be_truthy
    end
  end

  context "#password attribute" do
    let(:user) { FactoryGirl.build(:user, password: nil, password_confirmation: nil) }

    it 'requires a password on create' do
      expect(user).to_not be_valid
    end
  end

  it 'does not care about all the validation stuff when the user is temporary'
  it 'disallows regular assignment of roles that are restricted'
end
