# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  RSpec.describe TeacherCourseDataValidator do
    subject { described_class.run(course_data) }

    let(:course_data) { create(:google_classroom_api_course, course_state: course_state) }
    let(:course_state) { RestClient::ACTIVE_STATE }

    context 'owner' do
      let(:user_external_id) { course_data.owner_id }

      it { is_expected.to eq true }

      context 'archived' do
        let(:course_state) { RestClient::ARCHIVED_STATE }

        context 'not already imported' do
          it { is_expected.to eq false }
        end

        context 'already imported' do
          before { create(:classroom, google_classroom_id: course_data.id) }

          it { is_expected.to eq true }
        end
      end
    end
  end
end
