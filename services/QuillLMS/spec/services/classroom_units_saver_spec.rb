# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ClassroomUnitsSaver do
  let(:classroom1) { create(:classroom) }
  let(:classroom_data1) { { id: classroom1.id, assign_on_join: true, student_ids: [] } }
  let(:concatenate_existing_student_ids) { true }
  let(:unit) { create(:unit) }

  subject { described_class.run(classrooms_data, concatenate_existing_student_ids, unit.id) }

  context 'classroom_data1 with symbol based keys' do
    let(:classrooms_data) { [classroom_data1] }

    it { expect { subject }.to change(ClassroomUnit, :count).from(0).to(1) }
  end

  context 'classroom_data1 with string based keys' do
    let(:classrooms_data) { [classroom_data1.stringify_keys] }

    it { expect { subject }.to change(ClassroomUnit, :count).from(0).to(1) }
  end

  context 'classroom_data1 with duplicates' do
    let(:classrooms_data) { [classroom_data1, classroom_data1] }

    it { expect { subject }.to change(ClassroomUnit, :count).from(0).to(1) }
  end

  context 'classroom_data1 with nil id' do
    let(:classrooms_data) { [classroom_data1.merge(id: nil)] }

    it { expect { subject }.not_to change(ClassroomUnit, :count).from(0) }
  end

  context 'classroom_data1 with no id' do
    let(:classrooms_data) { [classroom_data1.except(:id)] }

    it { expect { subject }.not_to change(ClassroomUnit, :count).from(0) }
  end

  context 'classroom_data1 with student_ids = false and assign_on_join = false' do
    let(:classrooms_data) { [classroom_data1.merge(student_ids: false, assign_on_join: false)] }

    it { expect { subject }.not_to change(ClassroomUnit, :count).from(0) }
  end

  context 'two classroom_data1' do
    let(:classroom2) { create(:classroom) }
    let(:classroom_data2) { classroom_data1.merge(id: classroom2.id) }
    let(:classrooms_data) { [classroom_data1, classroom_data2] }

    it { expect { subject }.to change(ClassroomUnit, :count).from(0).to(2) }
  end

  context 'classroom_unit already exists' do
    let!(:classroom_unit) { create(:classroom_unit, classroom: classroom1, unit: unit) }
    let(:classrooms_data) { [classroom_data1] }

    it { expect { subject }.not_to change(ClassroomUnit, :count).from(1) }

    it do
      expect(ClassroomUnitsSaver).to receive(:run).once
      subject
    end
  end
end
