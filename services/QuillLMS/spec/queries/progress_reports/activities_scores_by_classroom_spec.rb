require 'rails_helper'

describe 'ActivitiesScoresByClassroom' do
  let(:classroom) {create(:classroom_with_classroom_units)}

  it "returns a row for each student that completed a visible activity session" do
    activity_sessions = classroom.classroom_units.first.activity_sessions
    ActivitySession.unscoped.each {|as| as.update(visible: true)}
    expect(ProgressReports::ActivitiesScoresByClassroom.results(classroom.owner.classrooms_i_teach.map(&:id)).length)
      .to eq(classroom.students.length)
  end

  it "returns the average score and activity count for each student that completed activity sessions" do
    results = ProgressReports::ActivitiesScoresByClassroom.results(classroom.owner.classrooms_i_teach.map(&:id))
    results.each do |res|
      diagnostic_and_lesson_activity_ids = Activity.where(activity_classification_id: [4, 6]).ids
      expect(ActivitySession.unscoped.where(user_id: res['student_id']).length).to eq(res['activity_count'])

      activity_session_percentage =
        ActivitySession.unscoped
          .where(user_id: res['student_id'])
          .where.not(activity_id: diagnostic_and_lesson_activity_ids)
          .pluck(:percentage)

      average_score = activity_session_percentage.reduce(:+).to_f / activity_session_percentage.length

      expect(res['average_score']).to eq average_score
    end
  end

  it 'does not return archived activity sessions' do
    new_student = create(:student)
    create(:students_classrooms, student: new_student, classroom: classroom)
    classroom_unit = classroom.classroom_units.first
    classroom_unit.assigned_student_ids << new_student.id
    create(:activity_session, user: classroom.students.first, classroom_unit: classroom_unit, visible: false)
    results = ProgressReports::ActivitiesScoresByClassroom.results(classroom.owner.classrooms_i_teach.map(&:id))
    expect(results.pluck("name")).not_to include(new_student.name)
  end

  describe '#transform_timestamps' do
    context 'invalid date time string' do
      it 'should not throw error when date string is nil' do
        data = [
          { 'last_active' => nil }
        ]
        expect do
          ProgressReports::ActivitiesScoresByClassroom.transform_timestamps!(data, "America/Chicago")
        end.to_not raise_error
      end

      it 'should not throw error when date string is malformed' do
        the_time = "abc"

        data = [
          { 'last_active' => the_time}
        ]
        expect do
          ProgressReports::ActivitiesScoresByClassroom.transform_timestamps!(data, "America/Chicago")
        end.to_not raise_error
      end
    end

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
