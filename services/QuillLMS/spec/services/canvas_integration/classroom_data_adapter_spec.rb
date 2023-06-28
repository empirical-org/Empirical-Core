# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CanvasIntegration::ClassroomDataAdapter do
  subject { described_class.run(course_data, section_data) }

  let(:course_data) { create(:canvas_course_data).deep_symbolize_keys }
  let(:section_data) { create(:canvas_section_data).deep_symbolize_keys }
  let(:student_data1) { create(:canvas_student_data).deep_symbolize_keys }
  let(:student_data2) { create(:canvas_student_data).deep_symbolize_keys }

  let(:classroom_name) { [course_data[:name], section_data[:name]].join(' - ') }

  context 'section and course have same id' do
    let(:students) { [] }

    before { section_data[:id] = course_data[:id] }

    context 'section and course have different names' do
      it { expect(subject).to eq classroom_data }
    end

    context 'section and course have the same name' do
      let(:classroom_name) { course_data[:name] }

      before { section_data[:name] = course_data[:name] }

      it { expect(subject).to eq classroom_data }
    end
  end

  context 'multiple students' do
    let(:students) do
      [
        { external_user_id: student_data1[:id], name: student_data1[:name] },
        { external_user_id: student_data2[:id], name: student_data2[:name] }
      ]
    end

    before { section_data[:students] = [student_data1, student_data2] }

    it { expect(subject).to eq classroom_data }
  end

  def classroom_data
    {
      name: classroom_name,
      external_classroom_id: section_data[:id],
      students: students
    }
  end
end

