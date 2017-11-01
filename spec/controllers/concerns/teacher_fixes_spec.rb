require 'rails_helper'

include TeacherFixes

describe TeacherFixes do
  let! (:classroom) {FactoryBot.create(:classroom)}
  let! (:student1) {FactoryBot.create(:student, classrooms: [classroom])}
  let! (:student2) {FactoryBot.create(:student, classrooms: [classroom])}
  let! (:student3) {FactoryBot.create(:student)}
  let! (:classroom_activity1) {FactoryBot.create(:classroom_activity, classroom: classroom)}
  let! (:classroom_activity2) {FactoryBot.create(:classroom_activity, classroom: classroom)}
  let! (:classroom_activity3) {FactoryBot.create(:classroom_activity, classroom: classroom)}
  let! (:final_score) {FactoryBot.create(:activity_session, user_id: student1.id, classroom_activity_id: classroom_activity1.id, is_final_score: true)}
  let! (:not_final_score) {FactoryBot.create(:activity_session, user_id: student1.id, classroom_activity_id: classroom_activity1.id)}
  let! (:lower_percentage) {FactoryBot.create(:activity_session, user_id: student1.id, classroom_activity_id: classroom_activity2.id, percentage: 0.3)}
  let! (:higher_percentage) {FactoryBot.create(:activity_session, user_id: student1.id, classroom_activity_id: classroom_activity2.id, percentage: 0.8)}
  let! (:started_earlier) {FactoryBot.create(:activity_session, user_id: student1.id, classroom_activity_id: classroom_activity3.id, started_at: Time.now)}
  let! (:started_later) {FactoryBot.create(:activity_session, user_id: student1.id, classroom_activity_id: classroom_activity3.id, started_at: Time.now - 5)}

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
        expect(started_earlier.visible).to be true
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

end
