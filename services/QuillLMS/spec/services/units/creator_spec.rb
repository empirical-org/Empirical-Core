# frozen_string_literal: true

require 'rails_helper'
require 'sidekiq/testing'
Sidekiq::Testing.fake!

describe Units::Creator do
  it 'creates a unit with a teacher' do
    classroom = create(:classroom)
    teacher   = classroom.owner
    activity  = create(:activity)

    Units::Creator.run(
      teacher,
      'Something Really Cool',
      [{id: activity.id}],
      [{id: classroom.id, student_ids: []}]
    )
    expect(Unit.last.user).to eq(teacher)
  end

  it 'kicks off an assign activity worker' do
    classroom = create(:classroom)
    teacher   = classroom.owner
    activity  = create(:activity)

    Units::Creator.run(
      teacher,
      'Something Really Cool',
      [{id: activity.id}],
      [{id: classroom.id, student_ids: []}]
    )
    expect(Unit.last.user).to eq(teacher)
  end
end
