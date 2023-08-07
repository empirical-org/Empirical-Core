# frozen_string_literal: true

require 'rails_helper'

module GoogleIntegration
  RSpec.describe ClassroomStudentsData do
    subject { described_class.new(classroom, client) }

    let(:classroom) { create(:classroom, :from_google) }
    let(:classroom_external_id) { classroom.classroom_external_id }
    let(:client) { double('client') }

    let(:raw_students_data) { create_list(:google_classroom_api_student, num_students, course_id: classroom_external_id) }
    let(:num_students) { 0 }
    let(:students_data) { raw_students_data.map { |student_data| StudentDataAdapter.run(student_data) } }
    let(:expected_results) { students_data.map { |student_data| student_data.merge(classroom: classroom) } }

    before { allow(client).to receive(:classroom_students).with(classroom_external_id).and_return(students_data) }

    it { expect(subject.classroom_external_id).to eq classroom_external_id }
    it { expect(subject.to_a).to eq expected_results }

    context 'one student' do
      let(:num_students) { 1 }

      it { expect(subject.to_a).to eq expected_results }
    end

    context 'multiple students' do
      let(:num_students) { 3 }

      it { expect(subject.to_a).to eq expected_results }
    end
  end
end

