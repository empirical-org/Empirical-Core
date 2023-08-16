# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  RSpec.describe ClassroomDataAdapter do
    subject { described_class.run(course, student_count) }

    let(:course) { create(:google_classroom_api_course) }
    let(:students) { students_response.students }

    let(:already_imported) { false }
    let(:classroom_external_id) { course.id.to_i }
    let(:classroom_name) { course.name }
    let(:student_count) { Faker::Number.number(digits: 2) }
    let(:year) { course.creation_time&.to_date&.year }

    let(:expected_results) do
      {
        alreadyImported: already_imported,
        classroom_external_id: classroom_external_id,
        name: classroom_name,
        studentCount: student_count,
        year: year
      }
    end

    it { is_expected.to eq expected_results }

    context 'classroom already imported' do
      let(:already_imported) { true }

      before { create(:classroom, google_classroom_id: classroom_external_id) }

      it { is_expected.to eq expected_results }
    end

    context 'section present' do
      let(:section) { 'A' }
      let(:course) { create(:google_classroom_api_course, section: section) }
      let(:classroom_name) { "#{course.name} - #{section}" }

      it { is_expected.to eq expected_results }
    end

    context 'creation time' do
      let(:creation_time) { '2023-08-05T18:01:49.492Z' }
      let(:course) { create(:google_classroom_api_course, creation_time: creation_time) }
      let(:year) { 2023 }

      it { is_expected.to eq expected_results }
    end
  end
end
