require 'rails_helper'

describe ClassroomActivitySorter do
  let(:activity) { double(:activity, due_date: Date.today - 1.day, created_at: Date.today - 7.days) }
  let(:activity1) { double(:activity, due_date: Date.today, created_at: Date.today - 5.days) }
  let(:activity2) { double(:activity, due_date: nil, created_at: Date.today - 3.days) }
  let(:activity3) { double(:activity, due_date: nil, created_at: Date.today - 1.days) }
  let(:activities) { [activity2, activity1, activity3, activity] }

  it 'should give the activities with due date in sorted by due and without due date in sorted by creation order' do
    expect(described_class.sort(activities)).to eq [activity, activity1, activity2, activity3]
  end
end