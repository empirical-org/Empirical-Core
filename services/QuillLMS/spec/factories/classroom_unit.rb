FactoryBot.define do
  factory :classroom_unit do
    unit            { create(:unit) }
    classroom       { create(:classroom) }
    assign_on_join  false
    visible true

    factory :classroom_unit_with_activity_sessions do
      after(:create) do |ca|
        create_list(:activity_session, 5)
      end
    end

    factory :lesson_classroom_unit_with_activity_sessions do
       activity = create(:lesson_activity, :with_follow_up)
       create(:unit_activity, unit: unit, activity: activity)
       after(:create) do |ca|
         create_list(:activity_session, 5, classroom_unit: ca, activity: activity)
       end
     end

  end
end
