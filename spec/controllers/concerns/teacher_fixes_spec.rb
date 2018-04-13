require 'rails_helper'

include TeacherFixes

describe TeacherFixes do
  let! (:classroom) {create(:classroom)}
  let! (:classroom2) {create(:classroom)}
  let! (:student1) {create(:student, classrooms: [classroom])}
  let! (:student2) {create(:student, classrooms: [classroom])}
  let! (:student3) {create(:student)}
  let! (:activity) {create(:activity)}
  let! (:classroom_activity1) {create(:classroom_activity, classroom: classroom)}
  let! (:classroom_activity2) {create(:classroom_activity, classroom: classroom)}
  let! (:classroom_activity3) {create(:classroom_activity, classroom: classroom)}
  let! (:classroom_activity4) {create(:classroom_activity, classroom: classroom, activity: activity)}
  let! (:final_score) {create(:activity_session, user_id: student1.id, classroom_activity_id: classroom_activity1.id, is_final_score: true)}
  let! (:not_final_score) {create(:activity_session, user_id: student1.id, classroom_activity_id: classroom_activity1.id)}
  let! (:lower_percentage) {create(:activity_session, user_id: student1.id, classroom_activity_id: classroom_activity2.id, percentage: 0.3)}
  let! (:higher_percentage) {create(:activity_session, user_id: student1.id, classroom_activity_id: classroom_activity2.id, percentage: 0.8)}
  let! (:started) {create(:activity_session, user_id: student1.id, classroom_activity_id: classroom_activity3.id, started_at: Time.now)}
  let! (:completed_earlier) {create(:activity_session, user_id: student1.id, classroom_activity_id: classroom_activity4.id, completed_at: Time.now - 5, state: 'finished', percentage: 0.7)}
  let! (:completed_later) {create(:activity_session, user_id: student1.id, classroom_activity_id: classroom_activity4.id, completed_at: Time.now, state: 'finished', percentage: 0.7)}
  let! (:classroom_activity_with_activity_sessions_1) {create(:classroom_activity_with_activity_sessions)}
  let! (:classroom_activity_with_activity_sessions_2) {create(:classroom_activity_with_activity_sessions)}

  describe '#merge_activity_sessions_between_two_classroom_activities' do
    it 'moves all activity sessions from the first classroom activity to the second' do
      old_ca_1_activity_session_ids = classroom_activity_with_activity_sessions_1.activity_sessions.ids
      expect(old_ca_1_activity_session_ids).not_to be_empty
      old_ca_2_activity_session_ids = classroom_activity_with_activity_sessions_2.activity_sessions.ids
      TeacherFixes::merge_activity_sessions_between_two_classroom_activities(classroom_activity_with_activity_sessions_1.reload, classroom_activity_with_activity_sessions_2.reload)
      new_ca_1_activity_session_ids = classroom_activity_with_activity_sessions_1.reload.activity_sessions.ids
      new_ca_2_activity_session_ids = classroom_activity_with_activity_sessions_2.reload.activity_sessions.ids
      expect(new_ca_1_activity_session_ids).to be_empty
      expect(new_ca_2_activity_session_ids).to match_array(old_ca_2_activity_session_ids.concat(old_ca_1_activity_session_ids))
    end
  end

  describe '#merge_two_classroom_activities' do
    let (:student_a) {create(:student)}
    let (:student_b) {create(:student)}
    let! (:classroom_with_classroom_activities) {create(:classroom_with_classroom_activities, students: [student_a, student_b])}
    let (:activity_session_1) {create(:activity_session, classroom_activity: classroom_with_classroom_activities.classroom_activities.first, user_id: student_a.id)}
    let (:activity_session_2) {create(:activity_session, classroom_activity: classroom_with_classroom_activities.classroom_activities.last, user_id: student_b.id)}

    def ca_1
      classroom_with_classroom_activities.classroom_activities.first
    end

    def ca_2
      classroom_with_classroom_activities.classroom_activities.last
    end

    def prep
      ca_1.update(assigned_student_ids: [student_a.id])
      ca_2.update(assigned_student_ids: [student_b.id])
      activity_session_1
      activity_session_2
    end

    it 'moves all assigned students from the first activity to the second' do
      prep
      expect(ca_1.assigned_student_ids).not_to be_empty
      all_assigned_students = ca_1.assigned_student_ids.push(ca_2.assigned_student_ids).flatten.uniq
      TeacherFixes::merge_two_classroom_activities(ca_1.reload, ca_2.reload)
      expect(ca_2.reload.assigned_student_ids).to eq(all_assigned_students)
    end

    it 'deletes the firt classroom activity' do
      prep
      expect(ca_1).to be
      old_ca_1_id = ca_1.id
      TeacherFixes::merge_two_classroom_activities(ca_1.reload, ca_2.reload)
      expect(ClassroomActivity.find_by_id(old_ca_1_id)).not_to be
    end

    it 'calls #self.merge_activity_sessions_between_two_classroom_activities' do
      prep
      TeacherFixes.should receive(:merge_activity_sessions_between_two_classroom_activities).with(ca_1, ca_2)
      TeacherFixes::merge_two_classroom_activities(ca_1.reload, ca_2.reload)
    end
  end

  describe "#hide_extra_activity_sessions" do
    context "there is an activity session with a final score" do
      it "leaves the activity session with a final score" do
        TeacherFixes::hide_extra_activity_sessions(classroom_activity1.id, student1.id)
        expect(final_score.visible).to be true
      end

      it "hides all other activity sessions with that user id and classroom activity id" do
        TeacherFixes::hide_extra_activity_sessions(classroom_activity1.id, student1.id)
        expect(ActivitySession.where(classroom_activity_id: classroom_activity1.id, user_id: student1.id).length).to be 1
      end

    end

    context "there are activities with percentages assigned" do
      it "leaves the activity session with the highest percentage" do
        TeacherFixes::hide_extra_activity_sessions(classroom_activity2.id, student1.id)
        expect(higher_percentage.visible).to be true
      end

      it "hides all other activity sessions with that user id and classroom activity id" do
        TeacherFixes::hide_extra_activity_sessions(classroom_activity2.id, student1.id)
        expect(ActivitySession.where(classroom_activity_id: classroom_activity2.id, user_id: student1.id).length).to be 1
      end

    end

    context "there are activities that have been started" do
      it "leaves the activity session that was started most recently" do
        TeacherFixes::hide_extra_activity_sessions(classroom_activity3.id, student1.id)
        expect(started.visible).to be true
      end

      it "hides all other activity sessions with that user id and classroom activity id" do
        TeacherFixes::hide_extra_activity_sessions(classroom_activity3.id, student1.id)
        expect(ActivitySession.where(classroom_activity_id: classroom_activity3.id, user_id: student1.id).length).to be 1
      end

    end

  end

  describe("#same_classroom?") do
    it 'returns true if the students are in the same classroom' do
      expect(TeacherFixes::same_classroom?(student1.id, student2.id)).to be true
    end
    it 'returns false if the students are not in the same classroom' do
      expect(TeacherFixes::same_classroom?(student1.id, student3.id)).to be false
    end
  end

  describe("#move_activity_sessions") do
    it 'finds or creates a classroom activity for the new classroom with that student assigned' do
      TeacherFixes::move_activity_sessions(student1, classroom, classroom2)
      started.reload
      new_ca = started.classroom_activity
      expect(new_ca.classroom).to eq(classroom2)
      expect(new_ca.assigned_student_ids).to include(student1.id)
      # expect(TeacherFixes::same_classroom?(student1.id, student2.id)).to be true
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

    it 'should move classroom activities to new classroom' do
      all_classroom_activities = classroom.classroom_activities + classroom2.classroom_activities
      TeacherFixes::merge_two_classrooms(classroom.id, classroom2.id)
      expect(classroom2.reload.classroom_activities.length).to eq(all_classroom_activities.length)
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
      completed_activity_sessions = TeacherFixes::get_all_completed_activity_sessions_for_a_given_user_and_activity(student1.id, activity.id)
      expect(completed_activity_sessions).to contain_exactly(completed_earlier, completed_later)
    end
  end

end
