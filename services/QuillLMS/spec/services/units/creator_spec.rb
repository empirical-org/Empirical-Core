# frozen_string_literal: true

require 'rails_helper'

describe Units::Creator do
  let(:classroom) { create(:classroom) }
  let(:teacher) { classroom.owner }
  let(:activity) { create(:activity) }

  before { Sidekiq::Testing.fake! }

  after { Sidekiq::Worker.clear_all }

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
