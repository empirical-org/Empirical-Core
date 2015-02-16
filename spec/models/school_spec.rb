require 'rails_helper'

describe School, type: :model do
  describe 'validations' do
    before do
      @school = School.new
    end

    it 'lower grade is within bounds' do
      @school.lower_grade = 5

      expect(@school.valid?).to eq(true)
    end

    it 'lower grade is out of bounds' do
      @school.lower_grade = -1

      expect(@school.valid?).to eq(false)
      expect(@school.errors[:lower_grade]).to eq([ 'must be between 0 and 12' ])
    end

    it 'upper grade is within bounds' do
      @school.upper_grade = 8

      expect(@school.valid?).to eq(true)
    end

    it 'upper grade is out of bounds' do
      @school.upper_grade = 14

      expect(@school.valid?).to eq(false)
      expect(@school.errors[:upper_grade]).to eq([ 'must be between 0 and 12' ])
    end

    it 'lower grade is below upper grade' do
      @school.lower_grade = 2
      @school.upper_grade = 8

      expect(@school.valid?).to eq(true)
    end

    it 'lower grade is above upper grade' do
      @school.lower_grade = 6
      @school.upper_grade = 3

      expect(@school.valid?).to eq(false)
      expect(@school.errors[:lower_grade]).to eq([ 'must be less than or equal to upper grade' ])
    end

  end
end
