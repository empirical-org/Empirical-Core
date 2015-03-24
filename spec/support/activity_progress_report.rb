shared_context 'Activity Progress Report' do
  let(:mr_kotter) { FactoryGirl.create :mr_kotter }

  let(:activity) { FactoryGirl.create(:activity) }
  let(:sweathogs) { FactoryGirl.create(:sweathogs, teacher: mr_kotter) }
  # Absolutely no way that this could get confusing.
  let(:sweatdogs) { FactoryGirl.create(:classroom, name: "Sweatdogs", teacher: mr_kotter)}
  let!(:horshack) { FactoryGirl.create(:arnold_horshack, classroom: sweathogs) }
  let!(:barbarino) { FactoryGirl.create(:vinnie_barbarino, classroom: sweatdogs) }
  let(:sweathogs_classroom_activity) { FactoryGirl.create(:classroom_activity,
    classroom: sweathogs, unit: sweathogs.units.first, activity: activity) }
  let(:sweatdogs_classroom_activity) { FactoryGirl.create(:classroom_activity,
    classroom: sweatdogs, unit: sweatdogs.units.first, activity: activity) }

  let(:horshack_session) do
    horshack.activity_sessions.create!(
      state: 'finished',
      time_spent: 120,
      percentage: 0.777778,
      classroom_activity: sweathogs_classroom_activity
    )
  end
  let(:barbarino_session) do
    barbarino.activity_sessions.create!(
      state: 'finished',
      time_spent: 120,
      percentage: 0.75,
      classroom_activity: sweatdogs_classroom_activity
    )
  end

  let(:sweathogs_sessions) { [horshack_session]}
  let(:sweatdogs_sessions) { [barbarino_session] }
  let!(:all_sessions) { sweathogs_sessions + sweatdogs_sessions}
end