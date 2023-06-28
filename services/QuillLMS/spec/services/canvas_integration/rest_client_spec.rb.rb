# frozen_string_literal: true

require 'rails_helper'

describe CanvasIntegration::RestClient do
  subject { described_class.new(canvas_auth_credential, canvas_instance) }

  let(:canvas_auth_credential) { create(:canvas_auth_credential) }
  let(:canvas_instance) { create(:canvas_instance) }
  let(:canvas_api) { double(::LMS::Canvas) }

  before { allow(::LMS::Canvas).to receive(:new).and_return(canvas_api) }

  describe '#teacher_classrooms' do
    let(:courses_path) { canvas_instance.url + described_class::COURSES_PATH }

    before { allow(canvas_api).to receive(:api_get_request).with(courses_path).and_return(courses) }

    context 'no classrooms' do
      let(:courses) { [] }

      it { expect(subject.teacher_classrooms).to eq [] }
    end

    context 'multiple classroom' do
      let(:course1) { create(:canvas_course_hash) }
      let(:course2) { create(:canvas_course_hash) }
      let(:courses) { [course1, course2] }

      let(:course1_data) { { external_id: course1[:id], name: course1[:name] } }
      let(:course2_data) { { external_id: course2[:id], name: course2[:name] } }

      before { allow(canvas_api).to receive(:api_get_request).with(courses_path).and_return(courses) }

      it { expect(subject.teacher_classrooms).to eq [course1_data, course2_data] }
    end
  end
end
