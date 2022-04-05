# frozen_string_literal: true

# == Schema Information
#
# Table name: districts
#
#  id             :integer          not null, primary key
#  city           :string
#  grade_range    :string
#  name           :string
#  phone          :string
#  state          :string
#  token          :string
#  total_schools  :integer
#  total_students :integer
#  zipcode        :integer
#  created_at     :datetime
#  updated_at     :datetime
#  clever_id      :string
#  nces_id        :integer
#
require 'rails_helper'

describe District, type: :model do
  it { should have_many(:schools) }
  it { should have_many(:districts_admins) }
  it { should have_many(:admins).through(:districts_admins) }
end
