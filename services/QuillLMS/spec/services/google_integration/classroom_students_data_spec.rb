# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoogleIntegration::ClassroomStudentsData do
  let(:classroom) { create(:classroom, :from_google) }
  let(:classroom_external_id) { classroom.classroom_external_id }

  let(:classroom_students_client) { double('classroom_students_client') }

  subject { described_class.new(classroom, classroom_students_client) }

  let(:raw_student_data1) { create(:google_classroom_student_payload) }
  let(:raw_student_data2) { create(:google_classroom_student_payload) }
  let(:raw_students_data) { [raw_student_data1, raw_student_data2] }
  let(:students_data) { GoogleIntegration::Classroom::Parsers::Students.run(raw_students_data) }
  let(:classroom_students_data) { students_data.map { |student_data| student_data.merge(classroom: classroom) } }

  before { allow(classroom_students_client).to receive(:call).with(classroom_external_id).and_return(raw_students_data) }

  it 'constructs an enumerable object whose elements are hashes containing classroom student data' do
    expect(subject.to_a).to match_array classroom_students_data
    expect(subject.classroom_external_id).to eq classroom_external_id
  end
end

