require 'rails_helper'

describe UpdateMilestonesWorker do
  let(:subject) { described_class.new }

  describe '#perform' do
    context 'when activity session is not found' do
      it 'should return nil' do
        expect(subject.perform("wrong_uid")).to eq nil
      end
    end

    context 'when activity session is found' do
      let(:activity) { create(:activity, activity_classification_id: 4) }
      let(:teacher) { create(:teacher) }
      let(:unit) { create(:unit, user: teacher) }
      let(:classroom_activity) { create(:classroom_activity, activity: activity, unit: unit) }
      let!(:completed_milestone) { create(:milestone, name: "Complete Diagnostic") }
      let!(:activity_session) { create(:activity_session, state: "finished", classroom_activity: classroom_activity) }

      it 'should add the diagnostic completed milestone to the teacher milestones' do
        expect(teacher.reload.milestones).to_not include(completed_milestone)
        subject.perform(activity_session.uid)
        expect(teacher.reload.milestones).to include(completed_milestone)
      end
    end
  end
end