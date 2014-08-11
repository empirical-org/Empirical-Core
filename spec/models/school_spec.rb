require 'spec_helper'

describe School, type: :model do
  describe 'validations' do
    before do
      @school = School.new
    end

    it 'lower grade is within bounds' do
      @school.lower_grade = 5

      @school.valid?.should == true
    end

    it 'lower grade is out of bounds' do
      @school.lower_grade = -1

      @school.valid?.should == false
      @school.errors[:lower_grade].should == [ 'must be between 0 and 12' ]
    end

    it 'upper grade is within bounds' do
      @school.upper_grade = 8

      @school.valid?.should == true
    end

    it 'upper grade is out of bounds' do
      @school.upper_grade = 14

      @school.valid?.should == false
      @school.errors[:upper_grade].should == [ 'must be between 0 and 12' ]
    end

    it 'lower grade is below upper grade' do
      @school.lower_grade = 2
      @school.upper_grade = 8

      @school.valid?.should == true
    end

    it 'lower grade is above upper grade' do
      @school.lower_grade = 6
      @school.upper_grade = 3

      @school.valid?.should == false
      @school.errors[:lower_grade].should == [ 'must be less than or equal to upper grade' ]
    end

  end
end
