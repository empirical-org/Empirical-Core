require 'rails_helper'
require 'sidekiq/testing'
Sidekiq::Testing.fake!



describe Units::Creator do
  let!(:teacher) { FactoryGirl.create(:teacher) }
  let!(:classroom) { FactoryGirl.create(:classroom, teacher: teacher) }

  describe 'unit_creator' do

    it 'creates a unit with teacher and kicks off an assign activity worker' do
      Units::Creator.run(teacher, 'Something Really Cool', [{id: 1}], [{id: classroom.id, student_ids: []}])
      expect(Unit.last.user).to eq(teacher)
      expect(AssignActivityWorker.jobs.size).to eq(1)
    end

  end
end
