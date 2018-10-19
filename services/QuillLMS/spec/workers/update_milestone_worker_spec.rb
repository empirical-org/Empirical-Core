require 'rails_helper'

describe UpdateMilestonesWorker do

  describe '#perform' do
    it 'returns nil when activity session is not found' do
      expect(described_class.new.perform("wrong_uid")).to eq nil
    end

    it 'adds the diagnostic completed milestone to the teacher milestones' do
      teacher = create(:teacher)
      unit = create(:unit, user: teacher)
      classroom_unit = create(:classroom_unit, unit: unit)
      completed_milestone = create(:milestone, name: "Complete Diagnostic")
      activity = create(:activity, activity_classification_id: 4)
      activity_session = create(:activity_session,
        state: "finished",
        classroom_unit: classroom_unit,
        activity: activity
      )
      expect(teacher.reload.milestones).to_not include(completed_milestone)
      described_class.new.perform(activity_session.uid)
      expect(teacher.reload.milestones).to include(completed_milestone)
    end
  end
end
