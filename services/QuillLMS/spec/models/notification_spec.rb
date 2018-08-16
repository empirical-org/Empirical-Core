require 'rails_helper'

RSpec.describe Notification do
  it { should validate_length_of(:text).is_at_most(500) }
  it { should validate_presence_of(:text) }
  it { should belong_to(:user) }
  it { should validate_presence_of(:user) }
end
