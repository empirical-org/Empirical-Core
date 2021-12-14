# frozen_string_literal: true

require 'rails_helper'

describe 'StudentOverview' do
  let!(:classroom) {create(:classroom_with_classroom_units)}
  let!(:student) {User.find(ActivitySession.first.user_id)}

  before { ClassroomUnit.update_all(assigned_student_ids: classroom.students.ids) }

  let(:assigned_activity_count) do
    RawSqlRunner.execute(
      <<-SQL
        SELECT COUNT(classroom_units.id)
        FROM classroom_units
        WHERE #{student.id} = ANY (classroom_units.assigned_student_ids::int[])
      SQL
    ).to_a.first['count'].to_i
  end

  it "returns at least as many rows as the student was assigned activities within that classroom" do
    expect(ProgressReports::StudentOverview.results(classroom.id, student.id).first.length)
      .to be >= assigned_activity_count
  end

  it "returns the score and time spent for each activity the student has completed" do
    ProgressReports::StudentOverview.results(classroom.id, student.id).each do |row|
      if row['activity_sessions_id']
        expect(row['percentage']).to eq ActivitySession.find(row['activity_sessions_id']).percentage
        expect(row['timespent']).to eq ActivitySession.find(row['activity_sessions_id']).timespent
      end
    end
  end
end
