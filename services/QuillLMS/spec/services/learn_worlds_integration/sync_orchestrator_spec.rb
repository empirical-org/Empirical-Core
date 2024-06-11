# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LearnWorldsIntegration::SyncOrchestrator do
  before do
    allow(LearnWorldsIntegration::SuspendedUsersRequest).to receive(:run).and_return [1,2]
  end

  context 'suspend and unsuspending users' do
    let(:orchestrator) { LearnWorldsIntegration::SyncOrchestrator.new }

    before do
      allow(orchestrator).to receive(:userwise_subject_areas_relation).and_return([
        double('User', learn_worlds_access?: false, external_id: 1),
        double('User', learn_worlds_access?: true, external_id: 2),
        double('User', learn_worlds_access?: false, external_id: 3),
        double('User', learn_worlds_access?: true, external_id: 4)
      ])
      allow(orchestrator).to receive(:learnworlds_suspended_ids).and_return([3, 4])
    end

    describe '#users_to_suspend' do
      it do
        expect(orchestrator.users_to_suspend.count).to eq 1
        expect(orchestrator.users_to_suspend.first.external_id).to eq 1
      end
    end

    describe '#users_to_unsuspend' do
      it do
        expect(orchestrator.users_to_unsuspend.count).to eq 1
        expect(orchestrator.users_to_unsuspend.first.external_id).to eq 4
      end
    end
  end

  describe '#enqueue_jobs' do
    let(:mock_worker) { double }
    let(:mock_user) { double }

    before { allow(mock_user).to receive(:external_id).and_return 1 }

    it 'should increment counter' do
      allow(mock_worker).to receive(:perform_in)

      expect do
        subject.enqueue_jobs([mock_user], mock_worker) {|u| [u.external_id]}
      end.to change(subject, :counter).by 1
    end

    it 'should schedule jobs sequentially according to smear rate' do
      expect(mock_worker).to receive(:perform_in).with(0, 1)
      expect(mock_worker).to receive(:perform_in).with(1, 1)
      expect(mock_worker).to receive(:perform_in).with(2, 1)
      expect(mock_worker).to receive(:perform_in).with(3, 1)

      subject.enqueue_jobs([mock_user, mock_user], mock_worker) {|u| [u.external_id]}

      subject.enqueue_jobs([mock_user, mock_user], mock_worker) {|u| [u.external_id]}
    end
  end

  describe '#self.string_to_subject_area_tag' do
    it 'converts a string to a LearnWorlds tag' do
      expect(described_class.string_to_subject_area_tag('History / Social Studies'))
        .to eq('subject_area_history_social_studies')

      expect(described_class.string_to_subject_area_tag('English as a New Language'))
        .to eq('subject_area_english_as_a_new_language')
    end
  end

  describe '#self.tags' do
    let(:user) { create(:user) }

    subject { described_class.tags(user) }

    context 'when the user is an admin' do
      before do
        allow(user).to receive(:admin?).and_return(true)
      end

      it 'includes the admin tag' do
        expect(subject).to include('admin')
      end

      it 'ignores nil values' do
        teacher_info_mock = double
        mock_subject_areas = ['math', 'Poly Sci'].map {|x| create(:subject_area, name: x) }

        allow(teacher_info_mock).to receive(:subject_areas).and_return mock_subject_areas
        allow(user).to receive(:teacher_info).and_return(teacher_info_mock)
        expect(subject).to match_array(
          ['subject_area_math', 'admin', 'subject_area_poly_sci']
        )
      end
    end

    context 'when the user is not an admin' do
      before do
        allow(user).to receive(:admin?).and_return(false)
      end

      it 'does not include the admin tag' do
        expect(subject).not_to include('admin')
      end
    end

  end

  describe '#initialize' do
    it 'should populate learnworlds_suspended_ids via SuspenedUsersRequest' do
      allow(LearnWorldsIntegration::SuspendedUsersRequest).to receive(:run).and_return [1,2]
      expect(subject.learnworlds_suspended_ids).to eq [1,2]
    end
  end
end
