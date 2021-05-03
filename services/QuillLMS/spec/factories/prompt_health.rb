FactoryBot.define do
  factory :prompt_health do
    text                          "this is some test prompt text"
    url                           "test-url.org/test"
    flag                          "alpha"
    incorrect_sequences           {rand(0..10)}
    focus_points                  {rand(0..10)}
    percent_common_unmatched      {rand(0.0..100.0)}
    percent_specified_algorithms  {rand(0.0..100.0)}
    difficulty                    {rand(0.0..5.0)}
    percent_reached_optimal       {rand(0.0..100.0)}
  end
end
