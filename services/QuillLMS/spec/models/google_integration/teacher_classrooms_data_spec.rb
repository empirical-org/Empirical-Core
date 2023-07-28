# frozen_string_literal: true

require 'rails_helper'

RSpec.describe GoogleIntegration::TeacherClassroomsData do
  let(:teacher) { create(:teacher) }

  subject { described_class.new(teacher, serialized_classrooms_data) }

  context 'no classrooms' do
    let(:serialized_classrooms_data) { [].to_json }

    it { expect(subject.count).to eq 0 }
  end

  context 'two classrooms' do
    let(:classroom_external_id1) { 123 }
    let(:classroom_external_id2) { 456 }

    let(:serialized_classrooms_data) do
      [
        { classroom_external_id: classroom_external_id1 },
        { classroom_external_id: classroom_external_id2 }
      ].to_json
    end

    let(:expected_classrooms_data) do
      [
        { classroom_external_id: classroom_external_id1, teacher_id: teacher.id },
        { classroom_external_id: classroom_external_id2, teacher_id: teacher.id }
      ]
    end

    it { expect(subject).to match_array expected_classrooms_data }
  end
end
