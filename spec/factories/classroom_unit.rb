FactoryBot.define do
  factory :classroom_unit do
    unit            { create(:unit) }
    classroom       { create(:classroom) }
    assign_on_join  false

    factory :classroom_unit_with_activity_sessions do
      after(:create) do |cu|
        unit_activity = create(:unit_activity, unit: cu.unit)
        create_list(:activity_session, 5, classroom_unit_id: cu.id, activity: unit_activity.activity)
      end
    end

    factory :lesson_classroom_unit_with_activity_sessions do
       after(:create) do |cu|
         unit_activity = create(:lesson_unit_activity, unit: cu.unit)
         create_list(:activity_session, 5, classroom_unit: cu, activity: unit_activity.activity)
       end
     end

  end
end
