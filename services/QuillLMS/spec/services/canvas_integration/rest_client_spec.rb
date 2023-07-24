# frozen_string_literal: true

require 'rails_helper'

describe CanvasIntegration::RestClient do
  let(:rest_client) { described_class.new(canvas_auth_credential) }

  let(:canvas_auth_credential) { create(:canvas_auth_credential) }
  let(:canvas_instance) { canvas_auth_credential.canvas_instance }
  let(:canvas_api) { double(::LMS::Canvas) }

  before { allow(::LMS::Canvas).to receive(:new).and_return(canvas_api) }

  describe '#teacher_classrooms' do
    subject { rest_client.teacher_classrooms }

    let(:courses_path) { described_class::COURSES_PATH }
    let(:courses_response) { double(HTTParty::Response, body: courses_data.to_json) }

    before { allow(canvas_api).to receive(:api_get_request).with(courses_path).and_return(courses_response) }

    context 'no classrooms' do
      let(:courses_data) { [] }
      let(:classrooms) { [] }

      it { is_expected.to eq(classrooms: classrooms) }
    end

    context 'one classroom' do
      let(:course_data) { create(:canvas_course_payload) }
      let(:courses_data) { [course_data] }
      let(:course_id) { course_data['id'] }
      let(:course_name) { course_data['name'] }

      let(:section_data) { create(:canvas_section_payload, id: course_id, name: course_name) }
      let(:sections_data) { [section_data] }
      let(:sections_path) { "#{courses_path}/#{course_id}/sections?include[]=students" }
      let(:sections_response) { double(HTTParty::Response, body: sections_data.to_json) }

      let(:already_imported) { false }
      let(:classroom_external_id) { CanvasClassroom.build_classroom_external_id(canvas_instance.id, course_id) }

      let(:classroom) do
        {
          alreadyImported: already_imported,
          classroom_external_id: classroom_external_id,
          name: course_name,
          students: []
        }
      end

      before { allow(canvas_api).to receive(:api_get_request).with(sections_path).and_return(sections_response) }

      it { is_expected.to eq(classrooms: [classroom]) }

      context 'classroom already imported' do
        let(:already_imported) { true }

        before { create(:canvas_classroom, canvas_instance_id: canvas_instance.id, external_id: section_data['id']) }

        it { is_expected.to eq(classrooms: [classroom]) }
      end
    end
  end

  describe '#classroom_students' do
    subject { rest_client.classroom_students(section_id) }

    let(:sections_path) { described_class::SECTIONS_PATH }
    let(:section_path) { "#{sections_path}/#{section_id}?include[]=students" }
    let(:section_response) { double(HTTParty::Response, body: section_data.to_json) }

    before { allow(canvas_api).to receive(:api_get_request).with(section_path).and_return(section_response) }

    context 'no students' do
      let(:section_id) { 0 }
      let(:section_data) { {} }
      let(:students) { [] }

      it { is_expected.to eq(students: students) }
    end

    context 'one section with students' do
      let(:course_data) { create(:canvas_course_payload) }

      let(:section_id) { course_data['id'] }
      let(:section_name) { course_data['name'] }
      let(:section_data) { create(:canvas_section_payload, id: section_id, name: section_name, students: [student_data]) }

      let(:student_data) { create(:canvas_student_payload) }
      let(:student_id) { student_data['id'] }
      let(:student_email) { student_data['login_id'] }
      let(:student_name) { student_data['name'] }

      let(:user_external_id) { CanvasAccount.build_user_external_id(canvas_instance.id, student_id) }

      let(:student) do
        {
          email: student_email,
          name: student_name,
          user_external_id: user_external_id
        }
      end

      before { allow(canvas_api).to receive(:api_get_request).with(section_path).and_return(section_response) }

      it { is_expected.to eq(students: [student]) }
    end
  end
end
