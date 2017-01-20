require 'rails_helper'

include LastActiveClassroom

describe LastActiveClassroom do
  let! (:teacher) {FactoryGirl.create(:teacher, username: 'dsdada', email: 'dsada@gmail.com')}

  describe "#last_active_classroom" do
    it "returns the classroom id of the class with the most recently completed activity session" do
      FactoryGirl.create_list(:classroom_with_classroom_activities, 10, teacher_id: teacher.id)
      last_completed_activity_session = ActivitySession.all.sort_by { |as| as.completed_at }.last
      expect(last_completed_activity_session.classroom_activity.classroom.id).to eq LastActiveClassroom::last_active_classroom(teacher.id)
    end
  end

end
