FactoryBot.define do
  factory :classroom_unit_activity_state do
    unit_activity            { create(:unit_activity) }
    classroom_unit       { create(:classroom_unit) }
    pinned  false
    locked  false
    completed  false

  end
end
