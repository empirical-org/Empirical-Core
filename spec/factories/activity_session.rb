FactoryGirl.define do
  factory :activity_session do

    is_retry false
    percentage 0.50
    state "started"
    time_spent 100
    completed_at  { 5.minutes.ago }
    temporary false

    user { User.first || FactoryGirl.create(:user) }
    activity { Activity.first || FactoryGirl.create(:activity) }


    factory :activity_session_with_random_completed_date do 
    	completed_at { (rand 1..100).minutes.ago }
    end

    factory :activity_session_incompleted do 
    	completed_at nil
    	state nil
    end

  end

end
