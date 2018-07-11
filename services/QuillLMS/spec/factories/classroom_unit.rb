FactoryBot.define do
  factory :classroom_unit do
    unit            { create(:unit) }
    classroom       { create(:classroom) }
    assign_on_join  false

    factory :classroom_unit_with_activity_sessions do
      after(:create) do |ca|
        create_list(:activity_session, 5)
      end
    end

    factory :lesson_classroom_unit_with_activity_sessions do
       after(:create) do |cu|
         create_list(:activity_session, 5, classroom_unit: cu, activity: create(:lesson_activity, :with_follow_up))
       end
     end

  end
end
