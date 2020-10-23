require 'rails_helper'

describe ActivityTopic, type: :model do
  it { should belong_to(:activity) }
  it { should belong_to(:topic) }
end