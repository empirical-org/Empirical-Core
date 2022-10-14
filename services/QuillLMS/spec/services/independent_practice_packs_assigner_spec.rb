# frozen_string_literal: true

require 'rails_helper'

RSpec.describe IndependentPracticePacksAssigner do
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

  let(:release_method) { PackSequence::STAGGERED_RELEASE }

  let(:pack_sequence) do
    create(:pack_sequence,
      classroom_id: classroom_id,
      diagnostic_activity_id: diagnostic_activity_id,
      release_method: PackSequence::STAGGERED_RELEASE
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
    let(:release_method) { PackSequence::STAGGERED_RELEASE }

    context 'Pack Sequence does not exist' do
      it { expect { subject }.to change(PackSequenceItem, :count).from(0).to(1) }
    end

    context 'Pack Sequence already exists' do
      before { pack_sequence }

      it { expect { subject }.not_to change(PackSequenceItem, :count).from(1) }
    end
  end

  context 'release method is not staggered release' do
    let(:release_method) { 'immediate' }

    it { expect(subject).to eq nil }

    context 'Pack Sequence already exists' do
      before { pack_sequence }

      it { expect { subject }.to change(PackSequence, :count).from(1).to(0) }
      it { expect { subject }.not_to change(PackSequenceItem, :count).from(0) }

      context 'Pack Sequence Items exist' do
        before { create(:pack_sequence_item, pack_sequence: pack_sequence) }

        it { expect { subject }.to change(PackSequenceItem, :count).from(1).to(0) }
      end
    end
  end
end
