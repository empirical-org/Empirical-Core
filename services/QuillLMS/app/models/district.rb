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
class District < ApplicationRecord

  has_many :schools

end
