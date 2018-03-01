FactoryBot.define do
  factory :referrals_user do
    user_id           { create(:teacher).id }
    referred_user_id  { create(:teacher).id }
  end
end
