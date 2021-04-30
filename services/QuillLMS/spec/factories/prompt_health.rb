FactoryBot.define do
  factory :prompt_health do
    text                          "this is some test prompt text"
    url                           "test-url.org/test"
    flag                          "alpha"
    incorrect_sequences           1
    focus_points                  9
    percent_common_unmatched      30.44
    percent_specified_algorithms  20.99
    difficulty                    2.22
    percent_reached_optimal       80.44
  end
end
