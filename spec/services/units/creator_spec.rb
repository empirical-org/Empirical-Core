require 'rails_helper'
require 'sidekiq/testing'
Sidekiq::Testing.fake!



describe Units::Creator do
  let!(:classroom) { create(:classroom) }
  let!(:teacher) { classroom.owner }

  describe 'unit_creator' do

    it 'creates a unit with teacher and kicks off an assign activity worker' do
      current_jobs = AssignActivityWorker.jobs.size
      Units::Creator.run(teacher, 'Something Really Cool', [{id: 1}], [{id: classroom.id, student_ids: []}])
      expect(Unit.last.user).to eq(teacher)
      expect(AssignActivityWorker.jobs.size).to eq(current_jobs + 1)
    end

  end
end
