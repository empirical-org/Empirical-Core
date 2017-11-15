require 'rails_helper'

describe "JoinClassroomAnalytics" do

  let(:analytics) { JoinClassroomAnalytics.new }
  let(:segment_analytics) { SegmentAnalytics.new }
  let(:track_calls) { segment_analytics.backend.track_calls }
  let(:identify_calls) { segment_analytics.backend.identify_calls }

  let(:classroom) { create(:classroom) }
  let(:teacher) { classroom.owner }
  let(:student) { create(:student, classrooms: [classroom]) }


  it 'identifies teacher' do
    analytics.track(student)
    expect(identify_calls[0][:user_id]).to eq(teacher.id)
  end

  it 'sends event for teacher' do
    analytics.track(student)
    expect(track_calls[0][:event]).to eq(SegmentIo::Events::TEACHERS_STUDENT_ACCOUNT_CREATION)
    expect(track_calls[0][:user_id]).to eq(teacher.id)
  end

end
