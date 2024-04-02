# frozen_string_literal: true

# == Schema Information
#
# Table name: prompt_healths
#
#  id                           :integer          not null, primary key
#  difficulty                   :float
#  flag                         :string
#  focus_points                 :integer
#  incorrect_sequences          :integer
#  percent_common_unmatched     :float
#  percent_reached_optimal      :float
#  percent_specified_algorithms :float
#  text                         :string
#  url                          :string
#  activity_health_id           :integer
#
# Foreign Keys
#
#  fk_rails_...  (activity_health_id => activity_healths.id) ON DELETE => cascade
#
FactoryBot.define do
  factory :prompt_health do
    text { 'this is some test prompt text' }
    url { 'test-url.org/test' }
    flag { 'alpha' }
    incorrect_sequences { rand(0..10) }
    focus_points { rand(0..10) }
    percent_common_unmatched { rand(0.0..100.0) }
    percent_specified_algorithms { rand(0.0..100.0) }
    difficulty { rand(0.0..5.0) }
    percent_reached_optimal { rand(0.0..100.0) }
  end
end
