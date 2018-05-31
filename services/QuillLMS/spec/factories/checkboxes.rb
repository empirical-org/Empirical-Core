FactoryBot.define do
  factory :checkbox do
    user_id       { create(:user).id }
    objective_id  { create(:objective).id }
  end
end
