# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LearnWorldsIntegration::Webhooks::EnrolledFreeCourseEventHandler do
  include_context 'LearnWorlds Enrolled Free Course Event Data'

  subject { described_class.run(enrolled_free_course_event_data) }

  it { expect { subject }.to change { LearnWorldsAccountCourseEvent.enrolled.count }.by(1) }
end
