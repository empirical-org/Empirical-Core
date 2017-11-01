require 'rails_helper'

describe School, type: :model do
  let!(:bk_school) { create :school, name: "Brooklyn Charter School", zipcode: '11206'}
  let!(:queens_school) { create :school, name: "Queens Charter School", zipcode: '11385'}
  let!(:bk_teacher) { create(:teacher, school: bk_school) }
  let!(:bk_teacher_colleague) { create(:teacher, school: bk_school) }
  let!(:queens_teacher) { create(:teacher, school: queens_school) }

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


  describe '#grant_premium_to_users' do

    it "gives premium to all of a schools users" do
      expect(bk_school.users.map(&:subscription).flatten.any?).to eq(false)
      bk_school.grant_premium_to_users
      expect(bk_school.users.reload.map(&:subscription).flatten.count).to eq(bk_school.users.count)
    end

    it 'does not give premium to users of other schools' do
      bk_school.grant_premium_to_users
      expect(queens_school.users.map(&:subscription).flatten.any?).to eq(false)
    end

  end
end
