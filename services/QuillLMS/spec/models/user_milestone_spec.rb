require 'rails_helper'

describe UserMilestone, type: :model do
  it { should belong_to(:user) }
  it { should belong_to(:milestone) }
end
