require 'spec_helper'

describe Teacher, :type => :model do

  #let(:teacher) { FactoryGirl.build(:classroom) }

  context "when behaves as a teacher" do

    context 'with an email' do

      let!(:teacher) { FactoryGirl.build(:teacher, email: nil) }

      it 'requires to be present' do
        expect(teacher).not_to be_valid
        expect(teacher.errors[:email]).not_to be_nil
      end

    end

  end

  describe "#all" do
    it "must returns an array of Users" do
      expect(Teacher.all).to be_an_instance_of(User::ActiveRecord_Relation)
    end
  end

  describe "#first" do
    it "must returns an instance of User" do
      expect(Teacher.first).to be_an_instance_of(User)
    end
  end

  describe "#where" do
    before do
      teacher=User.create(username: 'test', email: "test@user.com",  password: '123456', password_confirmation: '123456')      
      teacher.safe_role_assignment "teacher"
      teacher.save!
    end

    it "must locate an instance by conditions given" do
      expect(Teacher.where(email: "test@user.com")).to be_an_instance_of(User::ActiveRecord_Relation)
    end

    it "must not be present if conditions is false" do
      expect(Teacher.where(email: "test@")).not_to be_present
    end

  end

  describe "#find" do
    before do
      @teacher=User.create(username: 'test', email: "test@user.com",  password: '123456', password_confirmation: '123456')      
      @teacher.safe_role_assignment "teacher"
      @teacher.save!
    end

    it "must locate an instance by conditions given" do
      expect(Teacher.find(@teacher.id)).to be_an_instance_of(User)
    end

    it "must not be present if conditions is false" do
      expect{Teacher.find(0)}.to raise_error(ActiveRecord::RecordNotFound)
    end

  end

  describe "#count" do
    it "must returns an integer" do
      expect(Teacher.count).to be_an_instance_of(Fixnum)
    end
  end


end
