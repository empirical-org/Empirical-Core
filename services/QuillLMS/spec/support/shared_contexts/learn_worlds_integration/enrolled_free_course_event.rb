# frozen_string_literal: true

RSpec.shared_context 'LearnWorlds Enrolled Free Course Event' do
  include_context 'LearnWorlds Enrolled Free Course Event Data'

  let(:enrolled_free_course_event) do
    {
      "version" => 2,
      "type" => "enrolledFreeCourse",
      "trigger" => "enrolled_free",
      "school_id" => "60004a6de11ac0798538ccc2",
      "data" => enrolled_free_course_event_data
    }
  end
end
