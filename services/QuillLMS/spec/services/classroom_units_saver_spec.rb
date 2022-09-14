# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ClassroomUnitsSaver do
  let(:classroom1) { create(:classroom) }
  let(:classroom2) { create(:classroom) }
  let(:classroom_data1) { { id: classroom1.id, assign_on_join: true, student_ids: [] } }
  let(:classroom_data2) { { "id" => classroom2.id.to_s, "assign_on_join" => true, "student_ids" => [] } }
  let(:classroom_data3) { classroom_data1 }
  let(:classroom_data4) { { id: nil } }
  let(:classroom_data5) { { assign_on_join: false, student_ids: [] } }
  let(:classrooms_data) { [classroom_data1, classroom_data2, classroom_data3, classroom_data4, classroom_data5] }

  let(:concatenate_existing_student_ids) { true }

  let(:unit) { create(:unit) }

  subject { described_class.run(classrooms_data, concatenate_existing_student_ids, unit.id) }

  it { expect { subject }.to change(ClassroomUnit, :count).from(0).to(2) }

  context 'classroom_unit already exists' do
    let!(:classroom_unit) { create(:classroom_unit, classroom: classroom1, unit: unit) }

    it { expect { subject }.to change(ClassroomUnit, :count).from(1).to(2) }

    it do
      expect(ClassroomUnitsSaver).to receive(:run).once
      subject
    end
  end
end
