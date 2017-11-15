require 'rails_helper'

describe ProgressReports::Standards::ActivitySession do
  include_context 'Topic Progress Report'
  let(:filters) { {} }
  subject { ProgressReports::Standards::ActivitySession.new(teacher).results(filters)}

  it "must retrieve completed activity sessions representing the best scores for a teacher's students" do
    expect(subject.size).to eq(best_activity_sessions.size)
  end

  it "filters correctly for teacher" do
    a = create(:activity)
    c = create(:classroom)
    t = c.owner
    ca = create(:classroom_activity, activity: a, classroom: c)
    as = create(:activity_session,
                              state: 'finished',
                              completed_at: Time.now,
                              is_final_score: true,
                              percentage: 1,
                              classroom_activity: ca)
    expect(subject.size).to eq(best_activity_sessions.size)
  end
end
