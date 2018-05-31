require 'rails_helper'

RSpec.describe IpLocation, type: :model do
  it { should belong_to(:user) }
end
