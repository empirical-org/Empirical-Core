# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::DistrictClient do
  include_context "Clever District Classrooms Data"

  let(:teacher) { create(:teacher, clever_id: teacher_clever_id) }
  let(:district_token) { 'district-token' }

  let(:config) { double(:config) }
  let(:api_client) { double(:api_client, config: config) }
  let(:data_api) { double(:data_api, api_client: api_client) }

  let(:district_client) { described_class.new(district_token) }

  before do
    expect(Clever::DataApi).to receive(:new).and_return(data_api)
    expect(data_api).to receive(:api_client).and_return(api_client)
    expect(api_client).to receive(:config=)
  end

  context '#get_teacher_classrooms' do
    subject { district_client.get_teacher_classrooms(teacher_clever_id) }

    let(:classrooms_attrs) { [classroom1_attrs, classroom2_attrs]}
    let(:data) { classrooms_data }

    before { expect(data_api).to receive(:get_sections_for_teacher).with(teacher_clever_id).and_return(data) }

    it { is_expected.to eq classrooms_attrs }
  end

  context '#classroom_students' do
    subject { district_client.classroom_students(classroom_external_id) }

    let(:students_attrs) { [student1_attrs, student2_attrs] }

    before { expect(data_api).to receive(:get_students_for_section).with(classroom_external_id).and_return(data) }

    context 'classroom 1' do
      let(:data) { classroom1_students_data }
      let(:classroom_external_id) { classroom1_attrs[:classroom_external_id] }
      let(:students_attrs) { [student1_attrs, student2_attrs] }

      it { is_expected.to eq students_attrs}
    end

    context 'classroom 2' do
      let(:data) { classroom2_students_data }
      let(:classroom_external_id) { classroom2_attrs[:classroom_external_id] }
      let(:students_attrs) { [student3_attrs] }

      it { is_expected.to eq students_attrs}
    end
  end
end



