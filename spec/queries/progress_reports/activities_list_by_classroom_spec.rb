require 'rails_helper'

describe 'ActivitiesListByClassroom' do
  let(:classroom) {create(:classroom_with_classroom_activities)}

  it "returns a row for each student that completed an activity session" do
    expect(ProgressReports::ActivitiesListByClassroom.results(classroom.id).length).to eq(classroom.students.length)
  end

end
