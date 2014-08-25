require 'spec_helper'

describe User, :type => :model do

  let(:user) { FactoryGirl.build(:user) }

  #test valid and invalid result!
  describe ".authenticate" do

    before do 
      User.create(username: 'test',          password: '123456', password_confirmation: '123456')      
      User.create(email: 'test@example.com', password: '654321', password_confirmation: '654321')
    end 

    it 'authenticate a user by username ' do
      expect(User.authenticate(email: 'test',             password: '123456')).to be_truthy
    end

    it 'authenticate a user by email' do
      expect(User.authenticate(email: 'test@example.com', password: '654321')).to be_truthy
    end    

  end

  context "when is any kind of user" do
    let(:user) { FactoryGirl.build(:user) }

    it 'should be valid with valid info' do 
      expect(user).to be_valid
    end

    context "when email is present" do
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

  describe "#name" do

    context "with valid inputs" do

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

  end



  describe "#safe_role_assignment" do

    let(:user) { FactoryGirl.build(:user) }

    it "must assign 'user' role by default" do
      expect(user.safe_role_assignment "admin").to eq("user")
    end

    it "must assign 'teacher' role even with spaces" do
      expect(user.safe_role_assignment " teacher ").to eq("teacher")
    end

    it "must assign 'teacher' role when it's chosen" do
      expect(user.safe_role_assignment "teacher").to eq("teacher")
    end

    it "must assign 'student' role when it's chosen" do
      expect(user.safe_role_assignment "student").to eq("student")
    end

    it "must change the role to 'student' inside the instance" do
      user.safe_role_assignment "student"
      expect(user.role).to eq("student")
    end    

  end


  describe "#student?" do

    let(:user) { FactoryGirl.build(:user) }

    before do 
      user.safe_role_assignment "student"
    end

    it "must be true for 'student' roles" do
      expect(user.student?).to eq(true)
    end    

    it "must be false for another roles" do
      user.safe_role_assignment "teacher"
      expect(user.student?).to eq(false)
    end    

  end

  describe "#teacher?" do

    let(:user) { FactoryGirl.build(:user) }

    before do 
      user.safe_role_assignment "teacher"
    end

    it "must be true for 'teacher' roles" do
      expect(user.teacher?).to eq(true)
    end    

    it "must be false for another roles" do
      user.safe_role_assignment "admin"
      expect(user.teacher?).to eq(false)
    end    

  end  

  describe "#admin?" do

    let(:user) { FactoryGirl.build(:user) }
    let(:admin){ FactoryGirl.build(:admin)}

    it "must be false for another roles" do
      expect(user.admin?).to eq(false)
    end    

    it "must be true for admin role" do
      expect(admin.admin?).to eq(true)
    end    


  end  

  describe "#permanent?" do

    let(:user) { FactoryGirl.build(:user) }

    context "when is true for all roles but temporary" do

      it "must be true for user" do
        expect(user.permanent?).to eq(true)
      end    
      it "must be true for teacher" do
        expect(user.permanent?).to eq(true)
      end          
      it "must be true for student" do
        expect(user.permanent?).to eq(true)
      end                

    end

  end  
  

  describe "#refresh_token!" do

    let(:user) { FactoryGirl.build(:user) }

    it "must change the token value" do
      expect(user.token).to be_nil
      expect(user.refresh_token!).to eq(true)
      expect(user.token).to_not be_nil
    end    

  end  

  describe "#generate_password" do 
    let(:user) { FactoryGirl.build(:user) }

    it "must set a new password for the user" do
      old=user.password
      user.generate_password
      expect(user).to_not eq(old)
    end

  end





  context "when behaves as a student" do

    let(:classroom) { Classroom.new(code: '101') }

    before do
      @student = classroom.students.build(first_name: 'John', last_name: 'Doe')
      @student.generate_student
    end


    context 'if username is not present' do

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


    describe "#unfinished_activities" do 

      it "must returns an empty list when there aren't available yet" do 
        p @student.unfinished_activities(classroom)
      end

      it "must return which are available" do 
      end

    end

    describe "#finished_activities" do 

      it "must returns an empty list when there aren't available yet" do 
        p @student.finished_activities(classroom)
      end

      it "must return which are available" do 
      end

    end

    describe "#activity_sessions" do 
      describe "#rel_for_activity" do 
      end
    end

  end

  describe "#generate_student" do
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

  describe "#password" do
    let(:user) { FactoryGirl.build(:user, password: nil, password_confirmation: nil) }

    it 'requires a password on create' do
      expect(user).to_not be_valid
    end
    it "has an error on error list" do
      expect(user.errors[:password]).not_to be_nil
      
    end
  end

  it 'does not care about all the validation stuff when the user is temporary'
  it 'disallows regular assignment of roles that are restricted'
end
