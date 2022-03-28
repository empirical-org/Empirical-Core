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
FactoryBot.define do
  factory :district do
    clever_id { (1..24).map{(('a'..'f').to_a + (1..9).to_a).sample}.join } # mock a clever id
    token { (1..40).map{(('a'..'f').to_a + (1..9).to_a).sample}.join } # mock a clever token
    name { "City School District" }
  end
end
