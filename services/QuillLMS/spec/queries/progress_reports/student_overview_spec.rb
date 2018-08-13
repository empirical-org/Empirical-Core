require 'rails_helper'

describe 'StudentOverview' do
  let!(:classroom) {create(:classroom_with_classroom_units)}
  let!(:student) {User.find(ActivitySession.first.user_id)}

  before do
    ClassroomUnit.update_all(assigned_student_ids: classroom.students.ids)
  end

  it "returns at least as many rows as the student was assigned activities within that classroom" do
    assigned_activity_count = ActiveRecord::Base.connection.execute("SELECT COUNT(classroom_units.id) FROM classroom_units WHERE #{student.id} = ANY (classroom_units.assigned_student_ids::int[])").to_a.first['count'].to_i
    expect(ProgressReports::StudentOverview.results(classroom.id, student.id).first.length).to be >= assigned_activity_count
  end

  it "returns the score for each activity the student has completed" do
    ProgressReports::StudentOverview.results(classroom.id, student.id).each do |row|
      if row['activity_sessions_id']
        expect(ActivitySession.find(row['activity_sessions_id']).percentage).to eq(row['percentage'].to_f)
      end
    end
  end

end
