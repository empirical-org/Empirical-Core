require 'rails_helper'

describe ArchiveUnitsClassroomActivitiesWorker do
  let(:subject) { described_class.new }

  describe '#perform' do
    let!(:unit) { create(:unit) }
    let!(:classroom_activity) { create(:classroom_activity, unit: unit, visible: true) }

    it 'should hide all the associated classroom activities and activity sessions' do
      expect(ArchiveClassroomActivitiesActivitySessionsWorker).to receive(:perform_async).with(classroom_activity.id)
      subject.perform(unit.id)
      expect(classroom_activity.reload.visible).to eq false
    end
  end
end