require 'rails_helper'

RSpec.describe RawScore, type: :model do
  it { should validate_presence_of(:name) }
end
