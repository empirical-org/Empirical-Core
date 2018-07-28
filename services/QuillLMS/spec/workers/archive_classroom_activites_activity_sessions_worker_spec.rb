require 'rails_helper'

describe ArchiveClassroomActivitiesActivitySessionsWorker do
  let(:subject) { described_class.new }

  describe '#perform' do
    let!(:classroom_activity) { create(:classroom_activity) }
    let!(:activity_session) { create(:activity_session, classroom_activity: classroom_activity, visible: true) }

    it 'should find the classroom activity and hide all the associated sessions' do
      subject.perform(classroom_activity.id)
      expect(activity_session.reload.visible).to eq false
    end
  end
end
