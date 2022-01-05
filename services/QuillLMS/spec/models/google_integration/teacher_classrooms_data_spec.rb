# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoogleIntegration::TeacherClassroomsData do
  let(:teacher) { create(:teacher) }

  subject { described_class.new(teacher, serialized_classrooms_data) }

  context 'no classrooms' do
    let(:serialized_classrooms_data) { { classrooms: [] }.to_json }

    it 'has no elements' do
      expect(subject.count).to eq 0
    end
  end

  context 'two classrooms' do
    let(:google_classroom_id1) { 123 }
    let(:google_classroom_id2) { 456 }

    let(:serialized_classrooms_data) do
      {
        classrooms: [
          { id: google_classroom_id1 },
          { id: google_classroom_id2 }
        ]
      }.to_json
    end

    let(:expected_classrooms_data) do
      [
        { id: google_classroom_id1, google_classroom_id: google_classroom_id1, teacher_id: teacher.id },
        { id: google_classroom_id2, google_classroom_id: google_classroom_id2, teacher_id: teacher.id }
      ]
    end

    it 'has two elements' do
      subject.each_with_index { |classroom_data, index| expect(classroom_data).to eq expected_classrooms_data[index] }
    end
  end
end
