# frozen_string_literal: true

require 'rails_helper'

include TeacherFixes

describe TeacherFixes do
  let!(:classroom) { create(:classroom) }
  let!(:classroom2) { create(:classroom) }
  let!(:student1) { create(:student, classrooms: [classroom]) }
  let!(:student2) { create(:student, classrooms: [classroom]) }
  let!(:student3) { create(:student) }
  let!(:activity) { create(:activity) }
  let!(:unit1) { create(:unit) }
  let!(:unit2) { create(:unit) }
  let!(:classroom_unit1) { create(:classroom_unit, classroom: classroom, unit: unit1) }
  let!(:classroom_unit2) { create(:classroom_unit, classroom: classroom, unit: unit2) }
  let!(:classroom_unit3) { create(:classroom_unit, classroom: classroom) }
  let!(:classroom_unit4) { create(:classroom_unit, classroom: classroom) }

  let!(:final_score) do
    create(:activity_session, user_id: student1.id, classroom_unit_id: classroom_unit1.id, is_final_score: true)
  end

  let!(:not_final_score) do
    create(:activity_session, user_id: student1.id, classroom_unit_id: classroom_unit1.id)
  end

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
    create(:activity_session,
      user_id: student1.id,
      classroom_unit_id: classroom_unit4.id,
      completed_at: Time.current - 5,
      state: 'finished',
      percentage: 0.7,
      activity: activity
    )
  end

  let!(:completed_later) do
    create(:activity_session,
      user_id: student1.id,
      classroom_unit_id: classroom_unit4.id,
      completed_at: Time.current,
      state: 'finished',
      percentage: 0.7,
      activity: activity
    )
  end

  let!(:classroom_unit_with_activity_sessions1) { create(:classroom_unit_with_activity_sessions) }
  let!(:classroom_unit_with_activity_sessions2) { create(:classroom_unit_with_activity_sessions) }

  let(:today) { Date.current }
  let(:a_year_ago) { today - 1.year }

  describe '#merge_activity_sessions_between_two_classroom_units' do
    it 'moves all activity sessions from the first classroom unit to the second' do
      old_cu1_activity_session_ids = classroom_unit_with_activity_sessions1.reload.activity_sessions.ids
      expect(old_cu1_activity_session_ids).not_to be_empty
      old_cu2_activity_session_ids = classroom_unit_with_activity_sessions2.reload.activity_sessions.ids

      TeacherFixes::merge_activity_sessions_between_two_classroom_units(
        classroom_unit_with_activity_sessions1,
        classroom_unit_with_activity_sessions2
      )

      new_cu1_activity_session_ids = classroom_unit_with_activity_sessions1.reload.activity_sessions.ids
      new_cu2_activity_session_ids = classroom_unit_with_activity_sessions2.reload.activity_sessions.ids
      expect(new_cu1_activity_session_ids).to be_empty
      expect(new_cu2_activity_session_ids).to match_array(old_cu2_activity_session_ids + old_cu1_activity_session_ids)
    end

    it 'preserves the finished activity session if the FROM session is started and the TO session is finished' do
      started_activity_session =
        create(:activity_session,
          classroom_unit: classroom_unit_with_activity_sessions1,
          activity: activity,
          user: student1,
          updated_at: a_year_ago,
          state: 'started'
        )

      finished_activity_session =
        create(:activity_session,
          classroom_unit: classroom_unit_with_activity_sessions2,
          activity: activity,
          user: student1,
          updated_at: today,
          state: 'finished'
        )

      TeacherFixes::merge_activity_sessions_between_two_classroom_units(
        classroom_unit_with_activity_sessions1.reload,
        classroom_unit_with_activity_sessions2.reload
      )

      expect(started_activity_session.reload.visible).to be false
      expect(finished_activity_session.reload.visible).to be true
    end

    it 'preserves the finished activity session if the TO session is started and the FROM session is finished' do
      finished_activity_session =
        create(:activity_session,
          classroom_unit: classroom_unit_with_activity_sessions1,
          activity: activity,
          user: student1,
          updated_at: a_year_ago,
          state: 'finished'
        )

      started_activity_session =
        create(:activity_session,
          classroom_unit: classroom_unit_with_activity_sessions2,
          activity: activity,
          user: student1,
          updated_at: today,
          state: 'started'
        )

      TeacherFixes::merge_activity_sessions_between_two_classroom_units(
        classroom_unit_with_activity_sessions1.reload,
        classroom_unit_with_activity_sessions2.reload
      )

      expect(started_activity_session.reload.visible).to be false
      expect(finished_activity_session.reload.visible).to be true
      expect(finished_activity_session.reload.classroom_unit).to eq classroom_unit_with_activity_sessions2
    end

    it 'preserves the most recent activity session when it is in the TO classroom unit' do
      older_activity_session =
        create(:activity_session,
          classroom_unit: classroom_unit_with_activity_sessions1,
          activity: activity,
          user: student1,
          updated_at: a_year_ago
        )

      newer_activity_session =
        create(:activity_session,
          classroom_unit: classroom_unit_with_activity_sessions2,
          activity: activity,
          user: student1,
          updated_at: today
        )

      TeacherFixes::merge_activity_sessions_between_two_classroom_units(
        classroom_unit_with_activity_sessions1.reload,
        classroom_unit_with_activity_sessions2.reload
      )

      expect(older_activity_session.reload.visible).to be false
    end

    it 'preserves the most recent activity session when it is in the FROM classroom unit' do
      older_activity_session =
        create(:activity_session,
          classroom_unit: classroom_unit_with_activity_sessions2,
          activity: activity,
          user: student1,
          updated_at: a_year_ago
        )

      newer_activity_session =
        create(:activity_session,
          classroom_unit: classroom_unit_with_activity_sessions1,
          activity: activity,
          user: student1,
          updated_at: today
        )
      TeacherFixes::merge_activity_sessions_between_two_classroom_units(
        classroom_unit_with_activity_sessions1.reload,
        classroom_unit_with_activity_sessions2.reload
      )

      expect(older_activity_session.reload.visible).to be false
      expect(newer_activity_session.reload.classroom_unit).to eq(classroom_unit_with_activity_sessions2)
    end

    it 'migrates activity session over when the newer classroom unit does not contain that activity session' do
      older_activity_session =
        create(:activity_session,
          classroom_unit: classroom_unit_with_activity_sessions1,
          activity: activity,
          user: student1
        )

      TeacherFixes::merge_activity_sessions_between_two_classroom_units(
        classroom_unit_with_activity_sessions1.reload,
        classroom_unit_with_activity_sessions2.reload
      )

      expect(older_activity_session.reload.visible).to be true
      expect(older_activity_session.reload.classroom_unit).to eq(classroom_unit_with_activity_sessions2)
    end
  end

  describe '#merge_two_schools' do
    let!(:school) { create(:school) }
    let!(:other_school) { create(:school) }
    let!(:teacher) { create(:teacher) }

    it 'should move teachers to new school' do
      SchoolsUsers.create(school_id: school.id, user_id: teacher.id)
      expect(school.reload.users.length).to be(1)
      expect(other_school.reload.users.length).to be(0)
      TeacherFixes::merge_two_schools(school.id, other_school.id)
      expect(school.reload.users.length).to be(0)
      expect(other_school.reload.users.length).to be(1)
    end
  end

  describe '#merge_two_classrooms' do
    it 'should move students to new classroom' do
      all_students = (classroom.students + classroom2.students).uniq
      TeacherFixes::merge_two_classrooms(classroom.id, classroom2.id)
      expect(classroom2.reload.students.length).to eq(all_students.length)
    end

    it 'should move classroom units to new classroom' do
      all_classroom_units = classroom.classroom_units + classroom2.classroom_units
      TeacherFixes::merge_two_classrooms(classroom.id, classroom2.id)
      expect(classroom2.reload.classroom_units.length).to eq(all_classroom_units.length)
    end

    it 'should move teachers to new classroom' do
      all_teachers = (classroom.teachers + classroom2.teachers).uniq
      TeacherFixes::merge_two_classrooms(classroom.id, classroom2.id)
      expect(classroom2.reload.teachers.length).to eq(all_teachers.length)
    end

    it 'should archive the old classroom' do
      TeacherFixes::merge_two_classrooms(classroom.id, classroom2.id)
      expect(classroom.reload.visible).to be(false)
    end

  end

  describe '#delete_last_activity_session' do
    it "should delete a student's last completed activity session for a given activity" do
      TeacherFixes::delete_last_activity_session(student1.id, activity.id)
      expect(student1.activity_sessions.map(&:id)).not_to include(completed_later.id)
    end

    it "should update another activity session to be final score if possible" do
      TeacherFixes::delete_last_activity_session(student1.id, activity.id)
      expect(completed_earlier.reload.is_final_score).to be
    end
  end

  describe "#get_all_completed_activity_sessions_for_a_given_user_and_activity" do
    it "should return all of a student's completed activity sessions for a given activity id" do
      completed_activity_sessions =
        TeacherFixes::get_all_completed_activity_sessions_for_a_given_user_and_activity(student1.id, activity.id)
      expect(completed_activity_sessions).to contain_exactly(completed_earlier, completed_later)
    end
  end

  describe '#merge_two_units and #merge_two_classroom_units' do
    let(:student_a) { create(:student) }
    let(:student_b) { create(:student) }
    let!(:classroom_with_classroom_units) { create(:classroom, students: [student_a, student_b]) }
    let!(:unit5) do
      create(:unit, user_id: classroom_with_classroom_units.owner.id, classrooms: [classroom_with_classroom_units])
    end

    let!(:unit6) do
      create(:unit, user_id: classroom_with_classroom_units.owner.id, classrooms: [classroom_with_classroom_units])
    end

    let(:activity_session1) do
      create(:activity_session,
        classroom_unit: classroom_with_classroom_units.classroom_units.first,
        user_id: student_a.id
      )
    end

    let(:activity_session2) do
      create(:activity_session,
        classroom_unit: classroom_with_classroom_units.classroom_units.last,
        user_id: student_b.id
      )
    end

    let(:cu1) { classroom_with_classroom_units.classroom_units.first }
    let(:cu2) { classroom_with_classroom_units.classroom_units.last }

    describe '#merge_two_units' do
      describe 'the first unit passed' do
        it 'has no classroom units' do
          TeacherFixes::merge_two_units(unit1, unit2)
          expect(unit1.reload.classroom_units.where(visible: true)).to be_empty
        end
      end

      describe '#self.merge_two_classroom_units' do
        it 'is called when both units have a classroom unit with the same classroom' do
          expect(TeacherFixes).to receive(:merge_two_classroom_units).with(cu1, cu2)
          TeacherFixes::merge_two_units(cu1.unit, cu2.unit)
        end

        it 'is not called when both units do not have a classroom unit with the same classroom' do
          cu2.update(classroom: classroom2)
          expect(TeacherFixes).to_not receive(:merge_two_classroom_units).with(cu1, cu2.reload)
          TeacherFixes::merge_two_units(unit1, unit2)
        end
      end
    end

    describe '#merge_two_classroom_units' do
      before do
        cu1.update(assigned_student_ids: [student_a.id], unit_id: unit1.id)
        cu2.update(assigned_student_ids: [student_b.id], unit_id: unit2.id)
        activity_session1
        activity_session2
      end

      it 'moves all assigned students from the first activity to the second' do
        expect(cu1.assigned_student_ids).not_to be_empty
        all_assigned_students = cu1.assigned_student_ids.push(cu2.assigned_student_ids).flatten.uniq
        TeacherFixes::merge_two_classroom_units(cu1.reload, cu2.reload)
        expect(cu2.reload.assigned_student_ids).to eq(all_assigned_students)
      end

      it 'moves the most recent ClassroomUnitActivityState when it is on the TO classroom_unit' do
        ua = cu2.unit.unit_activities.first
        older_cuas =
          create(:classroom_unit_activity_state, classroom_unit: cu1, unit_activity: ua, updated_at: a_year_ago)

        newer_cuas =
          create(:classroom_unit_activity_state, classroom_unit: cu2, unit_activity: ua, updated_at: today)

        TeacherFixes::merge_two_classroom_units(cu1.reload, cu2.reload)
        expect(older_cuas.reload.visible).to be false
      end

      it 'moves the most recent ClassroomUnitActivityState when it is on the FROM classroom_unit' do
        ua = cu2.unit.unit_activities.first
        older_cuas =
          create(:classroom_unit_activity_state, classroom_unit: cu2, unit_activity: ua, updated_at: a_year_ago)

        newer_cuas =
          create(:classroom_unit_activity_state, classroom_unit: cu1, unit_activity: ua, updated_at: today)

        TeacherFixes::merge_two_classroom_units(cu1.reload, cu2.reload)
        expect{ older_cuas.reload }.to raise_error ActiveRecord::RecordNotFound
        expect(newer_cuas.reload.classroom_unit).to eq(cu2)
      end

      it 'moves the most recent ClassroomUnitActivityState when none exists on the TO classroom_unit' do
        ua = cu2.unit.unit_activities.first
        older_cuas = create(:classroom_unit_activity_state, classroom_unit: cu1, unit_activity: ua)
        TeacherFixes::merge_two_classroom_units(cu1.reload, cu2.reload)
        expect(older_cuas.reload.visible).to be true
        expect(older_cuas.reload.classroom_unit).to eq(cu2)
      end

      it 'calls #self.merge_activity_sessions_between_two_classroom_units' do
        expect(TeacherFixes).to receive(:merge_activity_sessions_between_two_classroom_units).with(cu1, cu2)
        TeacherFixes::merge_two_classroom_units(cu1.reload, cu2.reload)
      end
    end

    describe '#move_students_from_one_class_to_another' do
      it 'should update the classroom values if existing StudentClassroom record is not found' do
        student_classrooms = StudentsClassrooms.where(classroom_id: classroom.id)
        TeacherFixes::move_students_from_one_class_to_another(classroom.id, classroom2.id)
        student_classrooms.each do |sc|
          expect(sc.classroom).to eq(classroom2)
        end
      end

      it 'should archive the old StudentClassroom record if existing StudentClassroom record is found' do
        student_classrooms = StudentsClassrooms.where(classroom_id: classroom.id)
        create(:students_classrooms, student: student1, classroom: classroom2)
        create(:students_classrooms, student: student2, classroom: classroom2)
        TeacherFixes::move_students_from_one_class_to_another(classroom.id, classroom2.id)
        student_classrooms.each do |sc|
          expect(sc.skip_archive_student_associations).to eq(true)
          expect(sc.visible).to eq(false)
        end
      end
    end

  end

  describe '#recover_classroom_units_and_associated_activity_sessions' do
    it 'should unarchive the classroom units' do
      classroom_unit_with_activity_sessions1.update(visible: false)
      classroom_unit_with_activity_sessions2.update(visible: false)
      TeacherFixes::recover_classroom_units_and_associated_activity_sessions([classroom_unit_with_activity_sessions1, classroom_unit_with_activity_sessions2])
      expect(classroom_unit_with_activity_sessions1.reload.visible).to eq(true)
      expect(classroom_unit_with_activity_sessions2.reload.visible).to eq(true)
    end

    it 'should unarchive the associated activity sessions' do
      classroom_units = [classroom_unit_with_activity_sessions1, classroom_unit_with_activity_sessions2]
      activity_sessions = ActivitySession.where(classroom_unit: classroom_units)
      activity_sessions.each { |as| as.update(visible: false) }
      TeacherFixes::recover_classroom_units_and_associated_activity_sessions(classroom_units)
      activity_sessions.each { |as| expect(as.reload.visible).to eq(true) }
    end

    it 'should touch each activity session to bubble up touch for cache invalidation purposes' do
      first_activity_session = ActivitySession.find_by(classroom_unit: classroom_unit_with_activity_sessions1)
      stored_updated_at_value = first_activity_session.updated_at
      TeacherFixes::recover_classroom_units_and_associated_activity_sessions([classroom_unit_with_activity_sessions1])
      expect(first_activity_session.reload.updated_at).not_to equal(stored_updated_at_value)
    end
  end

  describe '#recover_unit_activities_for_units' do
    it 'should unarchive the unit activities' do
      create(:unit_activity, unit: unit1, visible: false)
      TeacherFixes::recover_unit_activities_for_units([unit1])
      unit1.unit_activities.each { |ua| expect(ua.reload.visible).to eq(true) }
    end

    it 'should touch the unit activity to bubble up touch for cache invalidation purposes' do
      first_unit_activity = create(:unit_activity, unit: unit1, visible: false)
      stored_updated_at_value = first_unit_activity.updated_at
      TeacherFixes::recover_unit_activities_for_units([unit1])
      expect(first_unit_activity.reload.updated_at).not_to equal(stored_updated_at_value)
    end
  end

  describe '#recover_units_by_id' do
    it 'should unarchive the units' do
      unit1.update(visible: false)
      TeacherFixes::recover_units_by_id([unit1.id])
      expect(unit1.reload.visible).to eq(true)
    end

    it 'should touch the unit to bubble up touch for cache invalidation purposes' do
      stored_updated_at_value = unit1.updated_at
      TeacherFixes::recover_units_by_id([unit1.id])
      expect(unit1.reload.updated_at).not_to equal(stored_updated_at_value)
    end
  end
end
