# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CleverIntegration::LibraryClassroomDataAdapter do
  include_context 'Clever Library Classrooms Data'

  subject { described_class.run(classroom_data) }

  context 'classroom_data1' do
    let(:classroom_data) { classroom1_data }

    it { expect(subject).to eq classroom1_attrs }

    context 'classroom already imported' do
      let(:classroom1_already_imported) { true }

      before { create(:classroom, clever_id: classroom1_clever_id) }

      it { expect(subject).to eq classroom1_attrs }
    end
  end

  context 'classroom_data2' do
    let(:classroom_data) { classroom2_data }

    it { expect(subject).to eq classroom2_attrs }
  end
end
