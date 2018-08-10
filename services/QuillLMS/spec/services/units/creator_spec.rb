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

  it 'posts assignment announcements to google classroom' do
    classroom         = create(:classroom)
    teacher           = classroom.owner
    activity          = create(:activity)
    unit_anmouncement = double('unit_anmouncement')

    allow(GoogleIntegration::UnitAnnouncement).to receive(:new)
      .and_return(unit_anmouncement)
    expect(unit_anmouncement).to receive(:post)

    Units::Creator.run(
      teacher,
      'Something Really Cool',
      [{id: activity.id}],
      [{id: classroom.id, student_ids: []}]
    )
  end
end
