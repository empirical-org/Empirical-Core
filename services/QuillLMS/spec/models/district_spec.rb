# == Schema Information
#
# Table name: districts
#
#  id         :integer          not null, primary key
#  name       :string
#  token      :string
#  created_at :datetime
#  updated_at :datetime
#  clever_id  :string
#
require 'rails_helper'

describe District, type: :model do
  it { should have_and_belong_to_many(:users) }
end
