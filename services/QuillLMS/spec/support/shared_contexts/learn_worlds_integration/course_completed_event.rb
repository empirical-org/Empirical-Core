# frozen_string_literal: true

RSpec.shared_context 'LearnWorlds Course Completed Event' do
  include_context 'LearnWorlds Course Completed Event Data'

  let(:course_completed_event) do
    {
      "version" => 2,
      "type" => "courseCompleted",
      "trigger" => "course_completed",
      "school_id" => "60004a6de11ac0798538ccc2",
      "data" => course_completed_event_data
    }
  end
end
