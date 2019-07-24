require 'rails_helper'

RSpec.describe Criterion, type: :model do

  describe 'associations' do
    it { should belong_to(:recommendation) }
    it { should belong_to(:concept) }
  end

  describe 'validations' do
    it { should validate_presence_of(:recommendation) }
    it { should validate_presence_of(:concept) }
    it { should validate_presence_of(:count) }
    it { should validate_inclusion_of(:no_incorrect).in?([ true, false ]) }
  end
end
