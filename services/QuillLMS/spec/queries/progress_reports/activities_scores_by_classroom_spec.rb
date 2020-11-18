require 'rails_helper'

describe 'ActivitiesScoresByClassroom' do
  let(:classroom) {create(:classroom_with_active_students)}

  it "returns a row for each student that completed an activity session" do
    expect(ProgressReports::ActivitiesScoresByClassroom.results(classroom.owner.classrooms_i_teach.map(&:id)).length).to eq(classroom.students.length)
  end

  it "returns student activity times in the timezone of the teacher (user)" do 
    results = ProgressReports::ActivitiesScoresByClassroom.results(classroom.owner.classrooms_i_teach.map(&:id))
    require 'pry'
  end


  it "returns the average score and activity count for each student that completed activity sessions" do
    results = ProgressReports::ActivitiesScoresByClassroom.results(classroom.owner.classrooms_i_teach.map(&:id))
    results.each do |res|
      diagnostic_and_lesson_activity_ids = Activity.where(activity_classification_id: [4, 6]).ids
      expect(ActivitySession.unscoped.where(user_id: res['student_id']).length).to eq(res['activity_count'].to_i)
      activity_session_percentage = ActivitySession.unscoped.where(user_id: res['student_id']).where.not(activity_id: diagnostic_and_lesson_activity_ids).pluck(:percentage)
      average_score = (activity_session_percentage.reduce(:+) / activity_session_percentage.length).to_f
      expect(average_score).to eq(res['average_score'].to_f)
    end
  end

end
