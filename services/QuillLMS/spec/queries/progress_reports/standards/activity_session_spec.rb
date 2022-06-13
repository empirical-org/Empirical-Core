# frozen_string_literal: true

require 'rails_helper'

describe ProgressReports::Standards::ActivitySession do
  include_context 'Standard Progress Report'
  let(:filters) { {} }

  subject { ProgressReports::Standards::ActivitySession.new(teacher).results(filters)}

  it "must retrieve completed activity sessions representing the best scores for a teacher's students" do
    expect(subject.size).to eq(best_activity_sessions.size)
  end

  it "filters correctly for teacher" do
    a = create(:activity)
    c = create(:classroom)
    s = create(:student)
    c.students << s
    cu = create(:classroom_unit, assigned_student_ids: [s.id], classroom: c)
    create(:unit_activity, activity: a, unit: cu.unit)

    as = create(
      :activity_session,
      state: 'finished',
      completed_at: Time.current,
      is_final_score: true,
      percentage: 1,
      classroom_unit: cu,
      user: s
    )

    expect(subject.size).to eq(best_activity_sessions.size)
  end
end
