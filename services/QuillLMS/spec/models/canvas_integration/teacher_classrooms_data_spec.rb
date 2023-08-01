# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CanvasIntegration::TeacherClassroomsData do
  let(:teacher) { create(:teacher) }

  subject { described_class.new(teacher, serialized_classrooms_data) }

  context 'no classrooms' do
    let(:serialized_classrooms_data) { [].to_json }

    it { is_expected.to match_array [] }
  end

  context 'two classrooms' do
    let(:canvas_instance_id1) { create(:canvas_instance).id }
    let(:canvas_instance_id2) { create(:canvas_instance).id }

    let(:external_id1) { Faker::Number.number }
    let(:external_id2) { Faker::Number.number }

    let(:classroom_external_id1) { CanvasClassroom.build_classroom_external_id(canvas_instance_id1, external_id1) }
    let(:classroom_external_id2) { CanvasClassroom.build_classroom_external_id(canvas_instance_id2, external_id2) }

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

    it { is_expected.to match_array expected_classrooms_data }
  end
end
