FactoryBot.define do
  factory :schools_admins do
    school { create(:school) }
    user { create(:user) }
  end
end
