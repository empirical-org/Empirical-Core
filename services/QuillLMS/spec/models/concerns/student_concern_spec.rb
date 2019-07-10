require 'rails_helper'


describe 'Student Concern' do
  let! (:student1) {create(:student, classrooms: [classroom])}

  let! (:activity) {create(:activity)}

  let! (:classroom) {create(:classroom)}
  let! (:classroom2) {create(:classroom)}

  let! (:classroom_unit1) {create(:classroom_unit, classroom: classroom)}
  let! (:classroom_unit2) {create(:classroom_unit, classroom: classroom)}
  let! (:classroom_unit3) {create(:classroom_unit, classroom: classroom)}
  let! (:classroom_unit4) {create(:classroom_unit, classroom: classroom)}

  let! (:final_score) {create(:activity_session, user_id: student1.id, classroom_unit_id: classroom_unit1.id, is_final_score: true)}
  let! (:not_final_score) {create(:activity_session, user_id: student1.id, classroom_unit_id: classroom_unit1.id)}
  let! (:lower_percentage) {create(:activity_session, user_id: student1.id, classroom_unit_id: classroom_unit2.id, percentage: 0.3)}
  let! (:higher_percentage) {create(:activity_session, user_id: student1.id, classroom_unit_id: classroom_unit2.id, percentage: 0.8)}
  let! (:started) {create(:activity_session, user_id: student1.id, classroom_unit_id: classroom_unit3.id, started_at: Time.now)}
  let! (:completed_earlier) {create(:activity_session, user_id: student1.id, classroom_unit_id: classroom_unit4.id, completed_at: Time.now - 5, state: 'finished', percentage: 0.7, activity: activity)}
  let! (:completed_later) {create(:activity_session, user_id: student1.id, classroom_unit_id: classroom_unit4.id, completed_at: Time.now, state: 'finished', percentage: 0.7, activity: activity)}

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

  describe("#move_activity_sessions") do
    it 'finds or creates a classroom unit for the new classroom with that student assigned' do
      student1.move_activity_sessions(classroom, classroom2)
      started.reload
      new_ca = started.classroom_unit
      expect(new_ca.classroom).to eq(classroom2)
      expect(new_ca.assigned_student_ids).to include(student1.id)
    end
  end


end
