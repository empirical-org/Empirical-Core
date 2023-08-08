# frozen_string_literal: true

# == Schema Information
#
# Table name: students_classrooms
#
#  id           :integer          not null, primary key
#  visible      :boolean          default(TRUE), not null
#  created_at   :datetime
#  updated_at   :datetime
#  classroom_id :integer
#  student_id   :integer
#
# Indexes
#
#  index_students_classrooms_on_classroom_id                 (classroom_id)
#  index_students_classrooms_on_student_id                   (student_id)
#  index_students_classrooms_on_student_id_and_classroom_id  (student_id,classroom_id) UNIQUE
#
require 'rails_helper'

describe StudentsClassrooms, type: :model, redis: true do
  it { should belong_to(:student).class_name('User') }
  it { should belong_to(:classroom).class_name("Classroom") }

  it { is_expected.to callback(:checkbox).after(:save) }
  it { is_expected.to callback(:run_associator).after(:save) }
  it { is_expected.to callback(:invalidate_classroom_minis).after(:commit) }

  describe '#archived_classrooms_manager' do
    let(:classrooms) { create(:students_classrooms) }

    it 'should return the correct hash' do
      expect(classrooms.archived_classrooms_manager).to eq(
        {
          joinDate: classrooms.created_at.strftime("%m/%d/%Y"),
          className: classrooms.classroom.name,
          teacherName: classrooms.classroom.owner.name,
          id: classrooms.id
        })
    end
  end

  context 'callbacks' do
    describe '#checkbox' do
      let(:students_classrooms) { build(:students_classrooms) }

      it 'should find or create a checkbox' do
        expect(students_classrooms).to receive(:find_or_create_checkbox).with(Objective::ADD_STUDENTS, students_classrooms.classroom.owner)
        students_classrooms.save
      end
    end

    describe '#run_associator' do
      let(:students_classrooms) { build(:students_classrooms, visible: true) }

      it 'should run the students to classrooms associator' do
        expect(Associators::StudentsToClassrooms).to receive(:run).with(students_classrooms.student, students_classrooms.classroom)
        students_classrooms.save
      end
    end

    describe '#archive_student_associations_for_classroom' do
      let(:student) { create(:student_in_two_classrooms_with_many_activities) }
      let(:student_classroom) { StudentsClassrooms.find_by(student_id: student.id) }

      it "should call the ArchiveStudentAssociationsForClassroomWorker" do
        expect(ArchiveStudentAssociationsForClassroomWorker).to receive(:perform_async).with(student.id, student_classroom.classroom_id)
        student_classroom.update(visible: false)
      end

      it "should not call the ArchiveStudentAssociationsForClassroomWorker if skip attribute is set to true" do
        student_classroom.skip_archive_student_associations = true
        expect(ArchiveStudentAssociationsForClassroomWorker).not_to receive(:perform_async).with(student.id, student_classroom.classroom_id)
        student_classroom.update(visible: false)
      end
    end

    describe '#invalidate_classroom_minis' do
      let(:classrooms) { create(:students_classrooms) }

      it "should invalidate the classroom minis" do
        $redis.set("user_id:#{classrooms.classroom.owner.id}_classroom_minis", "something")
        classrooms.run_callbacks(:commit)
        expect($redis.get("user_id:#{classrooms.classroom.owner.id}_classroom_minis")).to eq nil
      end
    end

    describe '#save_user_pack_sequence_items' do
      let!(:student_classroom) { create(:students_classrooms) }

      context 'visible has changed' do
        subject { student_classroom.update(visible: false) }

        it { expect { subject }.to change { SaveUserPackSequenceItemsWorker.jobs.size }.by(1) }
      end
    end
  end
end
