shared_context 'Activity Progress Report' do
  let(:teacher) { create :teacher }

  let(:activity) { create(:activity) }
  let(:sweathogs) { create(:sweathogs, teacher: teacher) }
  # Absolutely no way that this could get confusing.
  let(:sweatdogs) { create(:classroom, name: "Sweatdogs", teacher: teacher)}
  let!(:horshack) { create(:student, classrooms: [sweathogs]) }
  let!(:barbarino) { create(:student, classrooms: [sweatdogs]) }
  let(:sweathogs_classroom_activity) { create(:classroom_activity,
    classroom: sweathogs, unit: sweathogs.units.first, activity: activity) }
  let(:sweatdogs_classroom_activity) { create(:classroom_activity,
    classroom: sweatdogs, unit: sweatdogs.units.first, activity: activity) }

  let(:horshack_session) do
    horshack.activity_sessions.create!(
      state: 'finished',
      percentage: 0.777778,
      classroom_activity: sweathogs_classroom_activity
    )
  end
  let(:barbarino_session) do
    barbarino.activity_sessions.create!(
      state: 'finished',
      percentage: 0.75,
      classroom_activity: sweatdogs_classroom_activity
    )
  end

  let(:sweathogs_sessions) { [horshack_session]}
  let(:sweatdogs_sessions) { [barbarino_session] }
  let!(:all_sessions) { sweathogs_sessions + sweatdogs_sessions}
end