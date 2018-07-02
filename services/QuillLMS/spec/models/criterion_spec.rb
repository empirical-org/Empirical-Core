require 'rails_helper'

RSpec.describe Criterion, type: :model do

  describe 'associations' do
    it { should belong_to(:recommendation) }
    it { should belong_to(:concept) }
  end

  describe 'validations' do
    it { should validate_presence_of(:recommendation) }
    it { should validate_presence_of(:concept) }
    it { should validate_presence_of(:category) }
    it { should validate_presence_of(:count) }
  end

  describe 'enum' do
    it do
      should define_enum_for(:category).with([
        :correct_submissions,
        :incorrect_submissions
      ])
    end
  end
end
