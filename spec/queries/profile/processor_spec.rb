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
end