# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  RSpec.describe CourseStudentsAggregator do
    subject { described_class.run(api, course_id) }

    let(:api) { instance_double('Google::Apis::ClassroomV1::ClassroomService') }
    let(:course_id) { 'sample_course_id' }
    let(:response_factory) { :google_classroom_api_list_students_response }

    let(:page1_response) { create(response_factory, course_id: course_id, num_students: num_students1) }
    let(:page2_response) { create(response_factory, course_id: course_id, num_students: num_students2) }
    let(:expected_results) { responses.map(&:students).compact.flatten }

    before { allow(CourseStudentsIterator).to receive(:new).and_return(responses) }

    context 'page contains no students' do
      let(:num_students1) { 0 }
      let(:responses) { [page1_response] }

      it { is_expected.to eq expected_results }
    end

    context 'only one page of students' do
      let(:num_students1) { 2 }
      let(:responses) { [page1_response] }

      it { is_expected.to eq expected_results }
    end

    context 'multiple pages of students' do
      let(:num_students1) { 2 }
      let(:num_students2) { 1 }
      let(:responses) { [page1_response, page2_response] }

      it { is_expected.to eq expected_results }
    end
  end
end
