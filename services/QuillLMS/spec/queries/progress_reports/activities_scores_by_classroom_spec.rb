require 'rails_helper'

describe 'ActivitiesScoresByClassroom' do
  let(:classroom) {create(:classroom_with_classroom_units)}
  let(:active_students_classroom) {create(:classroom_with_active_students)}

  it "returns a row for each student that completed an activity session" do
    expect(ProgressReports::ActivitiesScoresByClassroom.results(classroom.owner.classrooms_i_teach.map(&:id)).length).to eq(classroom.students.length)
  end

  # it "returns student activity times in the timezone of the teacher (user)" do 
  #   results = ProgressReports::ActivitiesScoresByClassroom.results(
  #     classroom.owner.classrooms_i_teach.map(&:id), "America/Chicago")
  #   # TODO: control and inspect the last_active data, then add expectation
  # end

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

  describe '#transform_timestamps' do 
    context 'timezone available' do 
      it 'should modify the timestamp according to the given offset' do 
        the_time = "2020-11-19 19:00:00"

        data = [
          { 'last_active' => the_time }
        ]
        result = ProgressReports::ActivitiesScoresByClassroom.transform_timestamps!(data, "America/Chicago")
        expect(result.first['last_active']).to match("2020-11-19 13:00:00")
      end
    end

    context 'timezone not available' do 
      it 'should not modify the timestamp, because UTC +0 is implied' do 
        the_time = "2020-11-19 19:00:00"

        data = [
          { 'last_active' => the_time }
        ]

        result = ProgressReports::ActivitiesScoresByClassroom.transform_timestamps!(data, nil)
        expect(result.first['last_active']).to match("2020-11-19 19:00:00")
      end
    end

  end

end
