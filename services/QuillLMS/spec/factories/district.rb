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
#  zipcode        :string
#  created_at     :datetime
#  updated_at     :datetime
#  clever_id      :string
#  nces_id        :integer

FactoryBot.define do
  factory :district do
    clever_id { (1..24).map{(('a'..'f').to_a + (1..9).to_a).sample}.join } # mock a clever id
    token { (1..40).map{(('a'..'f').to_a + (1..9).to_a).sample}.join } # mock a clever token
    name { "City School District" }
    city { "Test City" }
    grade_range { "9-12" }
    phone { "(999)999-9999" }
    state { "NY" }
    zipcode { "55555" }
    total_schools { 4 }
    total_students { 5 }
    nces_id { "00000000" }
  end
end
