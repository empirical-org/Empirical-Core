require 'rails_helper'

describe District, type: :model do
  it { should have_and_belong_to_many(:users) }
end
