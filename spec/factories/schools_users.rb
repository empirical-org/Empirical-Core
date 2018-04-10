FactoryBot.define do
  factory :schools_users do
    school { create(:school) }
    user { create(:teacher) }
  end
end
