# == Schema Information
#
# Table name: raw_scores
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'rails_helper'

RSpec.describe RawScore, type: :model do
  it { should validate_presence_of(:name) }
end
