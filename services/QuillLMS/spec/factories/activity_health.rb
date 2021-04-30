FactoryBot.define do
  factory :activity_health do
    name                      "Test Activity"
    url                       "test-url.org/test"
    activity_categories       { create_pair(:activity_category).map(&:name) }
    content_partners          { create_pair(:content_partner).map(&:name)}
    tool                      "connect"
    diagnostics               { create_pair(:diagnostic_activity).map(&:name)}
    avg_difficulty            1.22
    avg_common_unmatched      1.2
    standard_dev_difficulty   0.34
    recent_plays              1000
    avg_mins_to_complete      10.4
    flag                      "production"
    activity_packs            [{id: 1, name: "Activity Pack Test"}]
  end
end
