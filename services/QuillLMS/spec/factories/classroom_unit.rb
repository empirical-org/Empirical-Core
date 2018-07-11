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

  end
end
