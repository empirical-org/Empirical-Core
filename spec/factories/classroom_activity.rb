FactoryBot.define do
  factory :classroom_activity do
    to_create {|instance| instance.save(validate: false) }
    unit {Unit.first || FactoryBot.create(:unit)}
    classroom {Classroom.first || FactoryBot.create(:classroom)}
    assign_on_join false
    activity {Activity.first || FactoryBot.create(:activity)}
	  factory :classroom_activity_with_activity do
	  	activity { Activity.first || FactoryBot.create(:activity) }
	  end

    factory :classroom_activity_with_activity_sessions do
      after(:create) do |ca|
        create_list(:activity_session_with_random_completed_date, 5, classroom_activity: ca, state: 'finished')
      end
    end
  end
end
