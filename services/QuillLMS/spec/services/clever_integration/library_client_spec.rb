# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::LibraryClient do
  include_context "Clever Library Classrooms Data"

  let(:teacher) { create(:teacher, clever_id: teacher_clever_id) }
  let(:bearer_token) { 'not-a-real-bearer-token' }
  let(:options) { { headers: { "Authorization": "Bearer #{bearer_token}" } } }

  subject { described_class.new(bearer_token) }

  context '#get_teacher_classrooms' do
    let(:http_response) { double(:http_response, parsed_response: classrooms_data) }
    let(:path) { "/teachers/#{teacher.clever_id}/sections" }
    let(:classrooms_attrs) { [classroom1_attrs, classroom2_attrs]}

    before { expect(described_class).to receive(:get).with(path, options).and_return(http_response) }

    it { expect(subject.get_teacher_classrooms(teacher.clever_id)).to eq classrooms_attrs }
  end

  context '#get_classroom_students' do
    let(:http_response) { double(:http_response, parsed_response: classroom_students_data) }
    let(:path) { "/sections/#{classroom_clever_id}/students" }

    before { expect(described_class).to receive(:get).with(path, options).and_return(http_response) }

    context 'classroom 1' do
      let(:classroom_students_data) { classroom1_students_data }
      let(:classroom_clever_id)  { classroom1_attrs[:clever_id] }
      let(:students_attrs) { [student1_attrs, student2_attrs] }

      it { expect(subject.get_classroom_students(classroom_clever_id)).to eq students_attrs }
    end

    context 'classroom 2' do
      let(:classroom_students_data) { classroom2_students_data }
      let(:classroom_clever_id)  { classroom2_attrs[:clever_id] }
      let(:students_attrs) { [student3_attrs] }

      it { expect(subject.get_classroom_students(classroom_clever_id)).to eq students_attrs }
    end
  end
end
