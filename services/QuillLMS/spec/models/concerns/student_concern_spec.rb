# frozen_string_literal: true

require 'rails_helper'

describe 'Student Concern', type: :model do
  let!(:classroom) { create(:classroom)}
  let!(:classroom2) { create(:classroom)}

  let!(:student1) { create(:student, classrooms: [classroom])}
  let!(:student2) { create(:student, classrooms: [classroom, classroom2])}
  let!(:student3) { create(:student, classrooms: [classroom, classroom2])}

  let!(:activity) { create(:activity)}

  let!(:unit) { create(:unit, user_id: classroom.owner.id)}

  let!(:classroom_unit1) do
    create(:classroom_unit, unit: unit, classroom: classroom, assigned_student_ids: [student1.id, student2.id])
  end

  let!(:classroom_unit2) { create(:classroom_unit, classroom: classroom, assigned_student_ids: [student1.id]) }
  let!(:classroom_unit3) { create(:classroom_unit, classroom: classroom, assigned_student_ids: [student1.id]) }
  let!(:classroom_unit4) { create(:classroom_unit, classroom: classroom, assigned_student_ids: [student1.id]) }
  let!(:classroom_unit5) { create(:classroom_unit, classroom: classroom2, assigned_student_ids: [student2.id]) }

  let!(:final_score) do
    create(:activity_session, user_id: student1.id, classroom_unit_id: classroom_unit1.id, is_final_score: true)
  end

  let!(:not_final_score) { create(:activity_session, user_id: student1.id, classroom_unit_id: classroom_unit1.id)}
  let!(:lower_percentage) do
    create(:activity_session, user_id: student1.id, classroom_unit_id: classroom_unit2.id, percentage: 0.3)
  end

  let!(:higher_percentage) do
    create(:activity_session, user_id: student1.id, classroom_unit_id: classroom_unit2.id, percentage: 0.8)
  end

  let!(:started) do
    create(:activity_session, user_id: student1.id, classroom_unit_id: classroom_unit3.id, started_at: Time.current)
  end

  let!(:completed_earlier) do
    create(
      :activity_session,
      user_id: student1.id,
      classroom_unit_id: classroom_unit4.id,
      completed_at: 5.seconds.ago,
      state: 'finished',
      percentage: 0.7,
      activity: activity
    )
  end

  let!(:completed_later) do
    create(
      :activity_session,
      user_id: student1.id,
      classroom_unit_id: classroom_unit4.id,
      completed_at: Time.current,
      state: 'finished',
      percentage: 0.7,
      activity: activity
    )
  end

  let!(:activity_session_for_second_student1) do
    create(:activity_session, user_id: student2.id, classroom_unit_id: classroom_unit1.id)
  end

  let!(:activity_session_for_second_student2) do
    create(:activity_session, user_id: student2.id, classroom_unit_id: classroom_unit5.id)
  end

  describe "#student_average_score" do
    let(:student_with_no_activity) { create(:student)}

    context "no average" do
      it "should not error" do
        expect(student_with_no_activity.student_average_score).to be 0
      end
    end
  end

  describe "#hide_extra_activity_sessions" do
    context "there is an activity session with a final score" do
      it "leaves the activity session with a final score" do
        student1.hide_extra_activity_sessions(classroom_unit1.id)
        expect(final_score.visible).to be true
      end

      it "hides all other activity sessions with that user id and classroom unit id" do
        student1.hide_extra_activity_sessions(classroom_unit1.id)
        expect(ActivitySession.where(classroom_unit_id: classroom_unit1.id, user_id: student1.id).length).to be 1
      end
    end

    context "there are activities with percentages assigned" do
      it "leaves the activity session with the highest percentage" do
        student1.hide_extra_activity_sessions(classroom_unit2.id)
        expect(higher_percentage.visible).to be true
      end

      it "hides all other activity sessions with that user id and classroom unit id" do
        student1.hide_extra_activity_sessions(classroom_unit2.id)
        expect(ActivitySession.where(classroom_unit_id: classroom_unit2.id, user_id: student1.id).length).to be 1
      end
    end

    context "there are activities that have been started" do
      it "leaves the activity session that was started most recently" do
        student1.hide_extra_activity_sessions(classroom_unit3.id)
        expect(started.visible).to be true
      end

      it "hides all other activity sessions with that user id and classroom unit id" do
        student1.hide_extra_activity_sessions(classroom_unit3.id)
        expect(ActivitySession.where(classroom_unit_id: classroom_unit3.id, user_id: student1.id).length).to be 1
      end
    end
  end

  describe "#move_activity_sessions" do
    it 'finds or creates a classroom unit for the new classroom with that student assigned' do
      student1.move_activity_sessions(classroom, classroom2)
      started.reload
      new_ca = started.classroom_unit
      expect(new_ca.classroom).to eq(classroom2)
      expect(new_ca.assigned_student_ids).to include(student1.id)
    end

    it 'should not raise error when moving to unit that has a naming collision' do
      new_unit_name = "#{student1.name}'s Activities from #{classroom.name}"
      same_named_unit = Unit.create!(name: new_unit_name, user_id: classroom2.owner.id)

      student1.move_activity_sessions(classroom, classroom2)
      started.reload
      new_ca = started.classroom_unit
      expect(new_ca.classroom).to eq(classroom2)
      expect(new_ca.assigned_student_ids).to include(student1.id)
    end

    it 'should create the necessary UnitActivity records for the new classroom' do
      expect { student1.move_activity_sessions(classroom, classroom2) }.to change(UnitActivity, :count).by(6)
    end
  end

  describe "#move_student_from_one_class_to_another" do
    subject { student1.move_student_from_one_class_to_another(classroom, classroom3) }

    let!(:classroom3) { create(:classroom) }
    let!(:classroom_unit6) { create(:classroom_unit, classroom: classroom3, assign_on_join: assign_on_join) }

    context 'assign_on_join false' do
      let(:assign_on_join) { false }

      it { expect { subject }.not_to change { classroom_unit6.reload.assigned_student_ids}.from([]) }
      it { expect { subject }.to change { student1.reload.classrooms }.from([classroom]).to([classroom3]) }
    end

    context 'assign_on_join true' do
      let(:assign_on_join) { true }

      it { expect { subject }.to change { classroom_unit6.reload.assigned_student_ids}.from([]).to([student1.id]) }
      it { expect { subject }.to change { student1.reload.classrooms }.from([classroom]).to([classroom3]) }
    end
  end

  describe "#merge_student_account" do
    context "called with no teacher id" do
      it "returns false when the students are not in the same classrooms" do
        expect(student1.merge_student_account(student2)).not_to be
      end

      it "calls merge_activity_sessions and remove_student_classrooms when the students are in the same classrooms" do
        StudentsClassrooms.find_or_create_by(classroom_id: classroom2.id, student_id: student1.id)
        expect(student1).to receive(:merge_activity_sessions).with(student2, nil)
        expect(student2).to receive(:remove_student_classrooms).with(nil)
        student1.merge_student_account(student2)
      end
    end

    context "called with a teacher id" do
      it "creates a students_classrooms record for any necessary classrooms" do
        ClassroomsTeacher.find_by(role: 'owner', classroom_id: classroom2.id).update(user_id: classroom.owner.id)
        student1.merge_student_account(student2, classroom.owner.id)
        student1.reload
        expect(StudentsClassrooms.find_by(student_id: student1.id, classroom_id: classroom2.id)).to be
      end

      it "calls merge_activity_sessions and remove_student_classrooms" do
        expect(student1).to receive(:merge_activity_sessions).with(student2, classroom.owner.id)
        expect(student2).to receive(:remove_student_classrooms).with(classroom.owner.id)
        student1.merge_student_account(student2, classroom.owner.id)
      end
    end
  end

  describe "#remove_student_classrooms" do
    context "called with no teacher id" do
      it "removes all of a student's student_classrooms" do
        student2.remove_student_classrooms
        student2.reload
        expect(student2.students_classrooms.length).to equal(0)
      end
    end

    context "called with a teacher id" do
      it "remove a student's student_classrooms for that teacher's classrooms" do
        student2.remove_student_classrooms(classroom.owner.id)
        student2.reload
        students_classrooms = StudentsClassrooms.unscoped.find_by(student_id: student2.id, classroom_id: classroom.id)
        expect(students_classrooms.visible).not_to be
      end
    end
  end

  describe "#merge_activity_sessions" do
    context "called with no teacher id" do
      it "transfers all of a student's activity sessions" do
        student1.merge_activity_sessions(student2)
        student2.reload
        expect(student2.activity_sessions.length).to equal(0)
      end
    end

    context "called with a teacher id" do
      it "transfers all of a student's activity sessions's for that teacher's classes" do
        student1.merge_activity_sessions(student2, classroom.owner.id)
        student2.reload
        expect(student2.activity_sessions.length).to equal(1)
      end
    end
  end

  describe "#same_classrooms_as_other_student" do
    it 'returns false if the students are not in the same classrooms' do
      expect(student1.same_classrooms_as_other_student(student2.id)).to be false
    end

    it 'returns true if the students are in the same classroom' do
      expect(student2.same_classrooms_as_other_student(student3.id)).to be true
    end
  end

  describe '#classrooms_shared_with_other_student' do
    let!(:classroom3) { create(:classroom, :with_no_teacher) }
    before { create(:classrooms_teacher, classroom: classroom3, user: classroom2.owner) }

    let!(:classroom4) { create(:classroom, :archived) }
    let!(:classroom5) { create(:classroom, :with_no_teacher) }

    let!(:student4) { create(:student, classrooms: [classroom, classroom2, classroom3, classroom4, classroom5]) }
    let!(:student5) { create(:student, classrooms: [classroom4, classroom5]) }

    subject { student.classrooms_shared_with_other_student(other_student.id, teacher_id) }

    context 'no teacher id given' do
      let(:teacher_id) { nil }

      context 'students share no classes' do
        let(:student) { student1 }
        let(:other_student) { student5 }

        it { expect(subject).to eq [] }
      end

      context 'students share one class' do
        let(:student) { student4 }
        let(:other_student) { student5 }

        it { expect(subject).to eq [{"classroom_id" => classroom5.id}] }
      end

      context 'students share multiple classes' do
        let(:student) { student2 }
        let(:other_student) { student3 }

        it { expect(subject).to match_array [{"classroom_id" => classroom.id}, {"classroom_id" => classroom2.id}] }
      end
    end

    context 'teacher_id given' do
      context 'students share no classes' do
        let(:teacher_id) { classroom3.owner.id }
        let(:student) { student3 }
        let(:other_student) { student5 }

        it { expect(subject).to eq [] }
      end

      context 'students share one class' do
        let(:teacher_id) { classroom2.owner.id }
        let(:student) { student2 }
        let(:other_student) { student3 }

        it { expect(subject).to match_array [{"classroom_id" => classroom2.id}] }
      end

      context 'classes with no owners does not break filtering' do
        let(:teacher_id) { classroom3.owner.id }
        let(:student) { student4 }
        let(:other_student) { student5 }

        it { expect(subject).to eq [] }
      end
    end
  end
end
