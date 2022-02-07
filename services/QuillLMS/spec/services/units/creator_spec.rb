# frozen_string_literal: true

require 'rails_helper'
require 'sidekiq/testing'
Sidekiq::Testing.fake!

describe Units::Creator do
  let(:classroom) { create(:classroom) }
  let(:teacher) { classroom.owner }
  let(:activity) { create(:activity) }

  it 'creates a unit with a teacher' do
    Units::Creator.run(
      teacher,
      'Something Really Cool',
      [{id: activity.id}],
      [{id: classroom.id, student_ids: []}]
    )
    expect(Unit.last.user).to eq(teacher)
  end
end
