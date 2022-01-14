# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::DistrictClassroomDataAdapter do
  include_context "Clever District Classrooms Data"

  subject { described_class.run(classroom_data) }

  context 'classroom_data1' do
    let(:classroom_data) { classroom1_data }

    it { expect(subject).to eq classroom1_attrs }
  end

  context 'classroom_data2' do
    let(:classroom_data) { classroom2_data }

    it { expect(subject).to eq classroom2_attrs }
  end

  context 'classroom_data3' do
    let(:classroom_data) { classroom3_data }

    it { expect(subject).to eq classroom3_attrs }
  end
end

