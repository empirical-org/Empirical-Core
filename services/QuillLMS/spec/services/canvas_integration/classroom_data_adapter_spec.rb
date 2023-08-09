# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CanvasIntegration::ClassroomDataAdapter do
  subject { described_class.run(canvas_instance_id, course_payload, section_payload) }

  let(:canvas_instance_id) { create(:canvas_instance).id }
  let(:course_payload) { create(:canvas_course_payload).deep_symbolize_keys }
  let(:section_payload) { create(:canvas_section_payload).deep_symbolize_keys }
  let(:student1_payload) { create(:canvas_student_payload).deep_symbolize_keys }
  let(:student2_payload) { create(:canvas_student_payload).deep_symbolize_keys }

  let(:already_imported) { false }
  let(:classroom_external_id) { CanvasClassroom.build_classroom_external_id(canvas_instance_id, section_payload[:id]) }
  let(:classroom_name) { [course_payload[:name], section_payload[:name]].join(' - ') }
  let(:students) { [] }

  let(:classroom_data) do
    {
      alreadyImported: already_imported,
      classroom_external_id: classroom_external_id,
      name: classroom_name,
      studentCount: students.count,
    }
  end

  context 'classroom already imported' do
    before { create(:canvas_classroom, canvas_instance_id: canvas_instance_id, external_id: classroom_external_id) }

    it { is_expected.to eq classroom_data }
  end

  context 'section and course have same id' do
    before { section_payload[:id] = course_payload[:id] }

    context 'section and course have different names' do
      it { is_expected.to eq classroom_data }
    end

    context 'section and course have the same name' do
      let(:classroom_name) { course_payload[:name] }

      before { section_payload[:name] = course_payload[:name] }

      it { is_expected.to eq classroom_data }
    end
  end

  context 'multiple students' do
    let(:user_external_id1) { CanvasAccount.build_user_external_id(canvas_instance_id, student1_payload[:id]) }
    let(:user_external_id2) { CanvasAccount.build_user_external_id(canvas_instance_id, student2_payload[:id]) }

    let(:students) do
      [
        { user_external_id: user_external_id1, name: student1_payload[:name] },
        { user_external_id: user_external_id2, name: student2_payload[:name] }
      ]
    end

    before { section_payload[:students] = [student1_payload, student2_payload] }

    it { is_expected.to eq classroom_data }
  end
end
