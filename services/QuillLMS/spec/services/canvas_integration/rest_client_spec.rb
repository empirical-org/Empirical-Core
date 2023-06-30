# frozen_string_literal: true

require 'rails_helper'

describe CanvasIntegration::RestClient do
  subject { described_class.new(canvas_auth_credential) }

  let(:canvas_auth_credential) { create(:canvas_auth_credential) }
  let(:canvas_instance) { canvas_auth_credential.canvas_instance }
  let(:canvas_api) { double(::LMS::Canvas) }
  let(:courses_response) { double(HTTParty::Response, body: courses_data.to_json) }

  before { allow(::LMS::Canvas).to receive(:new).and_return(canvas_api) }

  describe '#teacher_classrooms' do
    let(:courses_path) { described_class::COURSES_PATH }

    before { allow(canvas_api).to receive(:api_get_request).with(courses_path).and_return(courses_response) }

    context 'no classrooms' do
      let(:courses_data) { [] }
      let(:classrooms) { [] }

      it { expect(subject.teacher_classrooms).to eq(canvas_instance_id: canvas_instance.id, classrooms: classrooms) }
    end

    context 'one classroom' do
      let(:course_data) { create(:canvas_course_data) }
      let(:courses_data) { [course_data] }

      let(:section_data) { create(:canvas_section_data, id: course_data['id'], name: course_data['name']) }
      let(:sections_data) { [section_data] }
      let(:sections_path) { "#{courses_path}/#{course_data['id']}/sections?include[]=students" }
      let(:sections_response) { double(HTTParty::Response, body: sections_data.to_json) }

      let(:classrooms) { [{name: course_data['name'], external_classroom_id: course_data['id'], students: []}] }

      before { allow(canvas_api).to receive(:api_get_request).with(sections_path).and_return(sections_response) }

      it { expect(subject.teacher_classrooms).to eq(canvas_instance_id: canvas_instance.id, classrooms: classrooms) }
    end
  end
end
