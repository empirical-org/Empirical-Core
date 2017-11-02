FactoryBot.define do
  factory :district do
    clever_id { (1..24).map{(('a'..'f').to_a + (1..9).to_a).sample}.join } # mock a clever id
    token { (1..40).map{(('a'..'f').to_a + (1..9).to_a).sample}.join } # mock a clever token
    name { "#{Faker::Address.city} School District" }
  end
end
