FactoryBot.define do
  factory :activity_health do
    name                      "Test Activity"
    url                       "test-url.org/test"
    activity_categories       { create_pair(:activity_category).map(&:name) }
    content_partners          { create_pair(:content_partner).map(&:name)}
    tool                      "connect"
    diagnostics               { create_pair(:diagnostic_activity).map(&:name)}
    avg_difficulty            {rand(0.0..5.0)}
    avg_common_unmatched      {rand(0.0..100.0)}
    standard_dev_difficulty   {rand(0.0..100.0)}
    recent_plays              {rand(0..1000)}
    avg_mins_to_complete      {rand(0..30)}
    flag                      "production"
    activity_packs            [{id: 1, name: "Activity Pack Test"}]
  end
end
