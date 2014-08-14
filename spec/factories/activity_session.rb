FactoryGirl.define do
  factory :activity_session do


    percentage 0.50
    state "started"
    time_spent 100
    completed_at  { 5.minutes.ago }
    temporary false

    user { User.first || FactoryGirl.create(:user) }
    activity { Activity.first || FactoryGirl.create(:activity) }
  end
end
