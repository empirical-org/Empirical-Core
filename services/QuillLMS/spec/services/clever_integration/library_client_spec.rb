# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::LibraryClient do
  include_context 'Clever Library Classrooms Data'

  let(:client) { described_class.new(bearer_token) }
  let(:teacher) { create(:teacher, clever_id: teacher_clever_id) }
  let(:bearer_token) { 'not-a-real-bearer-token' }
  let(:options) { { headers: { "Authorization": "Bearer #{bearer_token}" } } }
  let(:http_response) { double(:http_response, code: code, parsed_response: parsed_response) }

  before { expect(described_class).to receive(:get).with(path, options).and_return(http_response) }

  describe '#classroom_students' do
    subject { client.classroom_students(classroom_external_id) }

    let(:path) { "/sections/#{classroom_external_id}/students" }

    context 'classroom 1' do
      let(:code) { 200 }
      let(:parsed_response) { classroom1_students_data }
      let(:classroom_external_id) { classroom1_attrs[:classroom_external_id] }
      let(:students_attrs) { [student1_attrs, student2_attrs] }

      it { is_expected.to eq students_attrs }
    end

    context 'classroom 2' do
      let(:code) { 200 }
      let(:parsed_response) { classroom2_students_data }
      let(:classroom_external_id) { classroom2_attrs[:classroom_external_id] }
      let(:students_attrs) { [student3_attrs] }

      it { is_expected.to eq students_attrs }
    end

    context 'unauthorized token' do
      let(:code) { 401 }
      let(:parsed_response) { { 'error' => 'Unrecognized token string' } }
      let(:classroom_external_id) { classroom1_attrs[:classroom_external_id] }

      it { is_expected.to eq [] }
      it { not_expected_to_report_error? }
    end

    context 'resource not found' do
      let(:code) { 404 }
      let(:parsed_response) { { 'error' => 'Resource not found' } }
      let(:classroom_external_id) { classroom1_attrs[:classroom_external_id] }

      it { is_expected.to eq [] }
      it { not_expected_to_report_error? }
    end

    context 'unknown error' do
      let(:code) { 500 }
      let(:parsed_response) { { 'error' => 'Unknown error' } }
      let(:classroom_external_id) { classroom1_attrs[:classroom_external_id] }

      it { is_expected.to eq [] }
      it { expected_to_report_error? }
    end
  end

  describe '#teacher_classrooms' do
    subject { client.teacher_classrooms(teacher.clever_id) }

    let(:path) { "/teachers/#{teacher.clever_id}/sections" }

    context 'successful response' do
      let(:code) { 200 }
      let(:parsed_response) { classrooms_data }
      let(:classrooms_attrs) { [classroom1_attrs, classroom2_attrs] }

      it { is_expected.to eq classrooms_attrs }
      it { not_expected_to_report_error? }
    end

    context 'unauthorized token' do
      let(:code) { 401 }
      let(:parsed_response) { { 'error' => 'Unrecognized token string' } }
      let(:classroom_external_id) { classroom1_attrs[:classroom_external_id] }

      it { is_expected.to eq [] }
      it { not_expected_to_report_error? }
    end

    context 'resource not found' do
      let(:code) { 404 }
      let(:parsed_response) { { 'error' => 'Resource not found' } }

      it { is_expected.to eq [] }
      it { not_expected_to_report_error? }
    end

    context 'unknown error' do
      let(:code) { 500 }
      let(:parsed_response) { { 'error' => 'Unknown error' } }

      it { is_expected.to eq [] }
      it { expected_to_report_error? }
    end
  end

  def not_expected_to_report_error?
    expect(ErrorNotifier).not_to receive(:report)
    subject
  end

  def expected_to_report_error?
    expect(ErrorNotifier).to receive(:report).with(an_instance_of(described_class::HttpError))
    subject
  end
end
