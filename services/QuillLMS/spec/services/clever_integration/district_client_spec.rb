# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::DistrictClient do
  include_context "Clever District Classrooms Data"

  let(:teacher) { create(:teacher, clever_id: teacher_clever_id) }
  let(:district_token) { 'district-token' }

  let(:config) { double(:config) }
  let(:api_client) { double(:api_client, config: config) }
  let(:data_api) { double(:data_api, api_client: api_client) }

  before do
    expect(Clever::DataApi).to receive(:new).and_return(data_api)
    expect(data_api).to receive(:api_client).and_return(api_client)
    expect(api_client).to receive(:config=)
  end

  subject { described_class.new(district_token) }

  context '#get_teacher_classrooms' do
    let(:classrooms_attrs) { [classroom1_attrs, classroom2_attrs]}
    let(:data) { classrooms_data }

    before { expect(data_api).to receive(:get_sections_for_teacher).with(teacher_clever_id).and_return(data) }

    it { expect(subject.get_teacher_classrooms(teacher_clever_id)).to eq classrooms_attrs }
  end

  context '#get_classroom_students' do
    let(:students_attrs) { [student1_attrs, student2_attrs] }

    before { expect(data_api).to receive(:get_students_for_section).with(classroom_clever_id).and_return(data) }

    context 'classroom 1' do
      let(:data) { classroom1_students_data }
      let(:classroom_clever_id) { classroom1_attrs[:clever_id] }
      let(:students_attrs) { [student1_attrs, student2_attrs] }

      it { expect(subject.get_classroom_students(classroom_clever_id)).to eq students_attrs }
    end

    context 'classroom 2' do
      let(:data) { classroom2_students_data }
      let(:classroom_clever_id) { classroom2_attrs[:clever_id] }
      let(:students_attrs) { [student3_attrs] }

      it { expect(subject.get_classroom_students(classroom_clever_id)).to eq students_attrs }
    end
  end
end



