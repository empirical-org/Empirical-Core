# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LearnWorldsIntegration::Webhooks::CourseCompletedEventHandler do
  include_context 'LearnWorlds Course Completed Event Data'

  subject { described_class.run(course_completed_event_data) }

  it { expect { subject }.to change { LearnWorldsAccountCourseEvent.completed.count }.by(1) }
end
