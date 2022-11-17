# frozen_string_literal: true

# == Schema Information
#
# Table name: classroom_units
#
#  id                   :integer          not null, primary key
#  assign_on_join       :boolean          default(FALSE)
#  assigned_student_ids :integer          default([]), is an Array
#  visible              :boolean          default(TRUE)
#  created_at           :datetime
#  updated_at           :datetime
#  classroom_id         :integer          not null
#  unit_id              :integer          not null
#
# Indexes
#
#  index_classroom_units_on_classroom_id              (classroom_id)
#  index_classroom_units_on_unit_id                   (unit_id)
#  index_classroom_units_on_unit_id_and_classroom_id  (unit_id,classroom_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (classroom_id => classrooms.id)
#  fk_rails_...  (unit_id => units.id)
#
require 'rails_helper'

describe ClassroomUnit, type: :model, redis: true do

  it { should belong_to(:classroom) }
  it { should belong_to(:unit) }
  it { should have_many(:activity_sessions) }
  it { should have_many(:classroom_unit_activity_states) }

  it { is_expected.to callback(:check_for_assign_on_join_and_update_students_array_if_true).before(:save) }
  it { is_expected.to callback(:hide_appropriate_activity_sessions).after(:save) }

  let!(:activity) { create(:activity) }
  let!(:student) { create(:student) }
  let!(:student2) { create(:student) }
  let!(:classroom) { create(:classroom, students: [student]) }
  let!(:classroom2) { create(:classroom) }
  let!(:teacher) {classroom.owner}
  let!(:unit) { create(:unit) }
  let!(:unit2) { create(:unit) }
  let!(:unit3) { create(:unit) }
  let!(:assigned_student_ids) { [student.id] }
  let!(:classroom_unit) { create(:classroom_unit, classroom: classroom, unit: unit, assigned_student_ids: assigned_student_ids) }
  let!(:activity_session) {create(:activity_session, :unstarted, classroom_unit: classroom_unit, user: student) }

  describe '#assigned_students' do
    let(:classroom_unit_with_no_assigned_students) { create(:classroom_unit, unit: unit2, classroom: classroom2, assigned_student_ids: []) }

    it 'must be empty if none assigned' do
      expect(classroom_unit_with_no_assigned_students.assigned_students).to be_empty
    end

    context 'when there is an assigned student' do
      let(:classroom) { create(:classroom, code: '101') }

      before do
        @student = classroom.students.build(first_name: 'John', last_name: 'Doe')
        @student.generate_student(classroom.id)
        @student.save!
        @new_classroom_unit = create(:classroom_unit, classroom: classroom, assigned_student_ids: [@student.id])
      end

      it 'must return a list with one element' do
        expect(@new_classroom_unit.assigned_students.first).to eq(@student)
      end
    end
  end

  describe '#teacher_and_classroom_name' do
    it "returns a hash with the name of the owner and the classroom" do
      expect(classroom_unit.teacher_and_classroom_name).to eq({teacher: teacher.name, classroom: classroom.name})
    end
  end

  describe '#validate_assigned_student' do

    context 'it must return true when' do

      it 'assign_on_join is true' do
        classroom_unit.assign_on_join = true
        expect(classroom_unit.validate_assigned_student(student.id)).to be true
      end

      it 'assigned_student_ids contains the student id' do
        classroom_unit.assigned_student_ids = [student.id]
        expect(classroom_unit.validate_assigned_student(student.id)).to be true
      end

    end

    it 'must return false when assigned_student_ids does not contain the student id and it was not assigned to the entire classroom' do
      classroom_unit.update(assigned_student_ids: [student.id + 10], assign_on_join: false)
      expect(classroom_unit.validate_assigned_student(student.id)).to be false
    end
  end

  describe 'validates non-duplicate' do
    it 'will not save a classroom unit with the same unit and classroom as another classroom unit' do
      expect(ClassroomUnit.new(classroom: classroom_unit.classroom, unit: classroom_unit.unit)).to_not be_valid
    end

    it 'will allow a classroom unit with the same classroom but different unit' do
      new_ca = create(:classroom_unit, classroom: classroom)
      expect(new_ca.persisted?).to be true
    end
  end

  describe '#check_for_assign_on_join_and_update_students_array_if_true callback' do
    context 'when assign_on_join is false' do
      let(:classroom_with_two_students) { create(:classroom, students: [student, student2])}
      let(:other_classroom_unit) { create(:classroom_unit, unit: unit3, classroom: classroom_with_two_students, assigned_student_ids: []) }

      describe 'when the assigned students contain all the students in the classroom' do
        it "sets the classroom unit to assign_on_join: true" do
          expect(other_classroom_unit.assign_on_join).not_to eq(true)
          other_classroom_unit.update!(assigned_student_ids: [student.id, student2.id])
          expect(other_classroom_unit.reload.assign_on_join).to eq(true)
        end
      end

      describe 'when the assigned students do not contain all the students in the classroom' do
        it "does not set the classroom unit to assign_on_join: true" do
          other_classroom_unit.update!(assign_on_join: false)
          other_classroom_unit.update!(assigned_student_ids: [])
          expect(other_classroom_unit.reload.assign_on_join).not_to eq(true)
        end
      end
    end

    context 'when assign_on_join is true' do
      it "updates the assigned student ids with all students in the classroom" do
        empty_classroom_unit = create(:classroom_unit, classroom: classroom, assign_on_join: true, assigned_student_ids: [])
        expect(empty_classroom_unit.reload.assigned_student_ids).to eq([student.id])
      end
    end
  end

  describe '#remove_assigned_student' do
    let(:student) { create(:student_in_two_classrooms_with_many_activities) }
    let(:student_classroom) { StudentsClassrooms.find_by(student_id: student.id) }
    let(:classroom_unit) { ClassroomUnit.find_by(classroom_id: student_classroom.classroom_id)}

    it "should remove the student's id from assigned_student_ids array from that classroom's classroom units" do
      classroom_unit.remove_assigned_student(student.id)
      expect(classroom_unit.assigned_student_ids).not_to include(student.id)
    end

    it "should archive the student's activity sessions for that classroom's classroom units" do
      classroom_unit.remove_assigned_student(student.id)
      activity_sessions = ActivitySession.where(classroom_unit_id: classroom_unit.id, user_id: student.id)
      expect(activity_sessions.count).to eq(0)
    end
  end

  describe '#touch_classroom_without_callbacks' do
    let!(:classroom) { create(:classroom) }
    let!(:classroom_unit) { create(:classroom_unit, classroom: classroom)}
    let(:initial_time) { 1.day.ago}

    it "should updated classrooms updated_at on classroom_unit save" do
      classroom.update_columns(updated_at: initial_time)
      classroom_updated_at = classroom.reload.updated_at

      classroom_unit.save

      expect(classroom.reload.updated_at.to_i).not_to equal(classroom_updated_at.to_i)
    end

    it "should update classrooms updated_t on classroom_unit touch" do
      classroom.update_columns(updated_at: initial_time)
      classroom_updated_at = classroom.reload.updated_at

      classroom_unit.touch

      expect(classroom.reload.updated_at.to_i).not_to equal(classroom_updated_at.to_i)
    end

    context "with a hidden classroom" do
      let(:classroom) { create(:classroom, visible: false) }
      let(:classroom_unit) { create(:classroom_unit, classroom: classroom)}

      it "should not raise an error" do
        expect {classroom_unit.save}.to_not raise_error
      end
    end
  end

  describe '#save_user_pack_sequence_items' do
    context 'after_save' do
      context 'assigned_student_ids has changed' do
        let!(:activity_session) {create(:activity_session, :unstarted, classroom_unit: classroom_unit, user: student2) }
        let(:new_assigned_student_ids) { [student.id, student2.id] }
        let(:num_assigned_students) { new_assigned_student_ids.count }

        subject { classroom_unit.update(assigned_student_ids: new_assigned_student_ids) }

        it do
          expect(classroom_unit).to receive(:save_user_pack_sequence_items)
          subject
        end
      end

      context 'visible has changed' do
        let(:num_assigned_students) { assigned_student_ids.count }

        subject { classroom_unit.update(visible: false) }

        it do
          expect(classroom_unit).to receive(:save_user_pack_sequence_items)
          subject
        end
      end
    end

    context 'after_destroy' do
      subject { classroom_unit.destroy }

      let(:num_assigned_students) { assigned_student_ids.count }

      it do
        expect(classroom_unit).to receive(:save_user_pack_sequence_items)
        subject
      end
    end
  end
end
