# frozen_string_literal: true

require 'rails_helper'

RSpec.describe ClassroomUnitUpdater do
  let(:classroom) { create(:classroom) }
  let(:assigned_student_ids) { [] }
  let(:classroom_unit) { create(:classroom_unit, assigned_student_ids: assigned_student_ids, classroom: classroom) }

  let(:student_ids) { assigned_student_ids }
  let(:assign_on_join) { false }
  let(:classroom_data) { { assign_on_join: assign_on_join, student_ids: student_ids } }

  let(:concatenate_existing_student_ids) { true }

  subject { described_class.run(classroom_data, classroom_unit, concatenate_existing_student_ids) }

  context 'student_ids is false' do
    let(:student_ids) { false }

    it { expect { subject }.to change { classroom_unit.reload.visible }.from(true).to(false) }

    context 'classroom_unit is archived' do
      before { classroom_unit.update(visible: false) }

      it { expect { subject }.not_to change { classroom_unit.reload.visible}.from(false) }
    end
  end

  context 'student_ids different than assigned_student_ids' do
    let(:student1) { create(:students_classrooms, classroom: classroom).student }
    let(:student2) { create(:students_classrooms, classroom: classroom).student }
    let(:concatenate_existing_student_ids) { true }
    let(:assigned_student_ids) { [student1.id] }
    let(:student_ids) { [student2.id] }

    it { expect { subject }.to change { classroom_unit.reload.assigned_student_ids }.to [student1.id, student2.id] }
    it { expect { subject }.not_to change { classroom_unit.reload.visible}.from(true) }
    it { unarchives_an_archived_classroom_unit }

    context 'concatenate_existing_student_ids is false' do
      let(:concatenate_existing_student_ids) { false }

      it { expect { subject }.to change { classroom_unit.reload.assigned_student_ids }.to [student2.id] }
      it { unarchives_an_archived_classroom_unit }
    end
  end

  context 'assign_on_join changed from false to true' do
    let(:assign_on_join) { true }

    before { classroom_unit.update!(assign_on_join: false) }

    it { expect { subject }.to change { classroom_unit.reload.assign_on_join }.from(false).to(true) }
    it { expect { subject }.not_to change { classroom_unit.reload.visible}.from(true) }
    it { unarchives_an_archived_classroom_unit }
  end

  it { unarchives_an_archived_classroom_unit }

  def unarchives_an_archived_classroom_unit
    classroom_unit.update(visible: false)

    expect { subject }.to change { classroom_unit.reload.visible}.from(false).to(true)
  end
end
