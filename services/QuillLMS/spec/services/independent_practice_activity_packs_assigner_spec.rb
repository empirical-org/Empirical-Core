# frozen_string_literal: true

require 'rails_helper'

RSpec.describe IndependentPracticeActivityPacksAssigner do
  subject do
    described_class.run(
      assigning_all_recommendations: true,
      classroom_id: classroom.id,
      diagnostic_activity_id: create(:diagnostic_activity).id,
      release_method: release_method,
      selections: selections,
      user: user
    )
  end

  let(:classroom) { create(:classroom) }
  let(:user) { classroom.owner }

  let(:unit_template1_selection) do
    ActionController::Parameters.new(
      id: create(:unit_template).id,
      classrooms: [{ student_ids: student_ids1, order: 0 }]
    )
  end

  let(:unit_template2_selection) do
    ActionController::Parameters.new(
      id: create(:unit_template).id,
      classrooms: [{ student_ids: student_ids2, order: 1 }]
    )
  end

  let(:release_method) { ActivityPackSequence::STAGGERED_RELEASE }

  let(:activity_pack_sequence) do
    create(:activity_pack_sequence,
      classroom_id: classroom_id,
      diagnostic_activity_id: diagnostic_activity_id,
      release_method: ActivityPackSequence::STAGGERED_RELEASE
    )
  end

  context 'user does not teach classroom being assigned' do
    let(:user) { create(:user) }
    let(:selections) { [] }

    it { expect { subject }.to raise_error described_class::TeacherNotAssociatedWithClassroomError }
  end

  context 'no selections' do
    let(:selections) { [] }

    it { expect(subject).to eq nil }
  end

  context 'selections but no students' do
    let(:selections) { [unit_template1_selection] }
    let(:student_ids1) { [] }

    it { expect { subject }.to change(Unit, :count).from(0).to(1) }

    it 'assigns no recommendations' do
      expect(AssignRecommendationsWorker).not_to receive(:perform_async)
      subject
    end
  end

  context 'selections with students' do
    let(:selections) { [unit_template1_selection, unit_template2_selection] }
    let(:student_ids1) { [1] }
    let(:student_ids2) { [1, 2] }

    it { expect { subject }.to change(Unit, :count).from(0).to(2) }

    it 'assigns two recommendations' do
      expect(AssignRecommendationsWorker).to receive(:perform_async).twice
      subject
    end
  end

  context 'release method is staggered release' do
    let(:release_method) { ActivityPackSequence::STAGGERED_RELEASE }

    context 'Activity Pack Sequence does not exist' do
      it { expect { subject }.to change(ActivityPackSequenceActivityPack, :count).from(0).to(1) }
    end

    context 'Activity Pack Sequence already exists' do
      before { activity_pack_sequence }

      it { expect { subject }.not_to change(ActivityPackSequenceActivityPack, :count).from(1) }
    end
  end

  context 'release method is not staggered release' do
    let(:release_method) { 'immediate' }

    it { expect(subject).to eq nil }

    context 'Activity Pack Sequence already exists' do
      before { activity_pack_sequence }

      it { expect { subject }.to change(ActivityPackSequence, :count).from(1).to(0) }

      context 'Activity Pack Sequence Activity Packs exist' do
        before { create(:activity_pack_sequence_activity_pack, activity_pack_sequence: activity_pack_sequence) }

        it { expect { subject }.to change(ActivityPackSequenceActivityPack, :count).from(1).to(0) }
      end
    end
  end
end
