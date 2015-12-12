require 'rails_helper'

describe ProgressReports::Standards::ActivitySession do
  include_context 'Topic Progress Report'
  let(:filters) { {} }
  subject { ProgressReports::Standards::ActivitySession.new(teacher).results(filters) }

  it "must retrieve completed activity sessions representing the best scores for a teacher's students" do
    expect(subject.size).to eq(best_activity_sessions.size)
  end
end
