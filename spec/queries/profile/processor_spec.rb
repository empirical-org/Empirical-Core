require 'rails_helper'

describe 'Profile::Processor' do
  include_context "profile"


  def subject
    Profile::Processor.new.query(student)
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

  it 'groups by state within unit' do
    results = subject
    x = results[unit1.name]['finished']
    expect(x).to contain_exactly(as1, as_1a, as_1aa, as_1b)
  end

  it 'sorts finished activities by percentage, then activity.activity_classification_id' do
    results = subject
    x = results[unit1.name]['finished']
    expect(x).to eq([as_1b, as1, as_1a, as_1aa])
  end

  it 'sorts unstarted activities by due_date, then activity.activity_classification_id' do
    results = subject
    x = results[unit2.name]['unstarted']
    expect(x).to eq([as_2b, as2, as_2a, as_2aa])
  end

  it 'treats started and unstarted as the same state' do
    as1.update_attributes(percentage: 0.8, state: 'unstarted')
    as_1a.update_attributes(percentage: 0.5, state: 'started')
    as_1aa.update_attributes(percentage: 0.5, state: 'finished')
    as_1b.update_attributes(percentage: 1, state: 'finished')
    results = subject
    x = Profile::Processor.new.send("sort_sessions_helper", results[unit1.name])
    expect(x).to eq({"unstarted" => [as_1a, as1], "finished" => [as_1b, as_1aa]})
  end

  it 'only shows completed activities when there are others with the same classroom_activity_id' do
    as1.update_attributes(classroom_activity_id: classroom_activity.id, state: 'unstarted')
    as_1b.update_attributes(classroom_activity_id: classroom_activity.id, state: 'unstarted')
    as_1a.update_attributes(classroom_activity_id: classroom_activity.id, state: 'started')
    as_1aa.update_attributes(classroom_activity_id: classroom_activity.id, percentage: 0.5, state: 'finished')
    results = Profile::Processor.new.query(student)
    puts results[unit1.name]
    expect(results[unit1.name]).to eq({"finished" =>[as_1aa], "unstarted" => []})
  end

end