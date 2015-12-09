require 'rails_helper'

describe 'Profile::SubProcessor' do
  include_context "profile"


  def subject
    results, is_last_page = Profile::SubProcessor.new.query(student, 20, 0)
    results
  end

  before do
    as1.update_attributes(percentage: 0.8, state: 'finished')
    as_1a.update_attributes(percentage: 0.5, state: 'finished')
    as_1aa.update_attributes(percentage: 0.5, state: 'finished')
    as_1b.update_attributes(percentage: 1, state: 'finished')
  end

  it 'groups by unit' do
    results = subject
    expect(results.keys).to contain_exactly(unit1.name, unit2.name)
  end

  it 'doesnt explode when theres a classroom_activity with no unit' do
    classroom_activity = FactoryGirl.create(:classroom_activity)
    as2 = FactoryGirl.create(:activity_session, classroom_activity: classroom_activity, user: student)
    results = subject
    expect(results.keys).to contain_exactly(unit1.name, unit2.name)
  end

  it 'groups by state within unit' do
    results = subject
    x = results[unit1.name][:finished]
    expect(x).to contain_exactly(as1, as_1a, as_1aa, as_1b)
  end

  it 'sorts finished activities by percentage, then activity.activity_classification_id' do
    results = subject
    x = results[unit1.name][:finished]
    expect(x).to eq([as_1b, as1, as_1a, as_1aa])
  end

  it 'sorts unstarted activities by due_date, then activity.activity_classification_id' do
    results = subject
    x = results[unit2.name][:not_finished]
    expect(x).to eq([as_2b, as2, as_2a, as_2aa])
  end

  it 'treats started and unstarted as the same state' do
    as1.update_attributes(percentage: 0.8, state: 'unstarted')
    as_1a.update_attributes(percentage: 0.5, state: 'started')
    as_1aa.update_attributes(percentage: 0.5, state: 'finished')
    as_1b.update_attributes(percentage: 1, state: 'finished')
    results = subject
    x = results[unit1.name]
    expect(x).to eq({not_finished: [as_1a, as1], finished: [as_1b, as_1aa]})
  end

  it 'only shows completed activities when there are others with the same classroom_activity_id' do
    as1.update_attributes(classroom_activity_id: classroom_activity.id, state: 'unstarted', is_retry: true)
    as_1b.update_attributes(classroom_activity_id: classroom_activity.id, state: 'unstarted', is_retry: true)
    as_1a.update_attributes(classroom_activity_id: classroom_activity.id, state: 'started', is_retry: true)
    as_1aa.update_attributes(classroom_activity_id: classroom_activity.id, percentage: 0.5, state: 'finished')
    results = subject
    expect(results[unit1.name]).to eq({finished: [as_1aa]})
  end

end