require 'rails_helper'

describe 'ActivitiesScoresByClassroom' do
  let(:classroom) {create(:classroom_with_classroom_activities)}

  it "returns a row for each student that completed an activity session" do
    expect(ProgressReports::ActivitiesScoresByClassroom.results(classroom.owner.classrooms_i_teach.map(&:id)).length).to eq(classroom.students.length)
  end

  it "returns the average score and activity count for each student that completed activity sessions" do
    results = ProgressReports::ActivitiesScoresByClassroom.results(classroom.owner.classrooms_i_teach.map(&:id))
    results.each do |res|
      activity_session_percentage = ActivitySession.where(user_id: res['student_id']).pluck(:percentage)
      expect(activity_session_percentage.length).to eq(res['activity_count'].to_i)
      average_score = (activity_session_percentage.reduce(:+) / activity_session_percentage.length).to_f
      expect(average_score).to eq(res['average_score'].to_f)
    end
  end

end
