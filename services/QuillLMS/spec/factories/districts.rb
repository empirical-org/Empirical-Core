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
FactoryBot.define do
  factory :district do
    clever_id { (1..24).map{(('a'..'f').to_a + (1..9).to_a).sample}.join } # mock a clever id
    token { (1..40).map{(('a'..'f').to_a + (1..9).to_a).sample}.join } # mock a clever token
    name { "City School District" }
  end
end
