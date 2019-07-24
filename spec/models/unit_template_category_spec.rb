require 'rails_helper'

RSpec.describe UnitTemplateCategory, type: :model do
  it { should have_many(:unit_templates) }
  it { should validate_presence_of(:name) }
  it { should validate_uniqueness_of(:name) }
end
