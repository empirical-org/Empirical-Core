require 'rails_helper'

RSpec.describe Recommendation, type: :model do

  describe 'associations' do
    it { should belong_to(:activity) }
    it { should belong_to(:unit_template) }
    it { should have_many(:criteria).dependent(:destroy) }
  end

  describe 'validations' do
    it { should validate_length_of(:name).is_at_most(150) }
    it { should validate_length_of(:name).is_at_least(2) }
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:activity) }
    it { should validate_presence_of(:category) }
    it { should validate_presence_of(:unit_template) }
  end

  describe 'enum' do
    it do
      should define_enum_for(:category).with([
        :independent_practice,
        :group_lesson
      ])
    end
  end
end
