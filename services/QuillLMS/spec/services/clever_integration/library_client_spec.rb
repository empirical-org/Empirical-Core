# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::LibraryClient do
  include_context 'Clever Library Classrooms Data'

  let(:client) { described_class.new(bearer_token) }
  let(:teacher) { create(:teacher, clever_id: teacher_clever_id) }
  let(:bearer_token) { 'not-a-real-bearer-token' }
  let(:options) { { headers: { "Authorization": "Bearer #{bearer_token}" } } }

  before { expect(described_class).to receive(:get).with(path, options).and_return(http_response) }

  context '#classroom_students' do
    subject { client.classroom_students(classroom_external_id) }

    let(:http_response) { double(:http_response, parsed_response: classroom_students_data) }
    let(:path) { "/sections/#{classroom_external_id}/students" }

    context 'classroom 1' do
      let(:classroom_students_data) { classroom1_students_data }
      let(:classroom_external_id)  { classroom1_attrs[:classroom_external_id] }
      let(:students_attrs) { [student1_attrs, student2_attrs] }

      it { is_expected.to eq students_attrs}
    end

    context 'classroom 2' do
      let(:classroom_students_data) { classroom2_students_data }
      let(:classroom_external_id)  { classroom2_attrs[:classroom_external_id] }
      let(:students_attrs) { [student3_attrs] }

      it { is_expected.to eq students_attrs}
    end
  end

  context '#teacher_classrooms' do
    subject { client.teacher_classrooms(teacher.clever_id) }

    let(:http_response) { double(:http_response, parsed_response: classrooms_data) }
    let(:path) { "/teachers/#{teacher.clever_id}/sections" }
    let(:classrooms_attrs) { [classroom1_attrs, classroom2_attrs]}

    it { is_expected.to eq classrooms_attrs }
  end
end
