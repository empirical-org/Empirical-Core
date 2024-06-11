# frozen_string_literal: true

require 'rails_helper'

RSpec.describe LearnWorldsIntegration::SyncOrchestrator do
  let(:worker) { described_class.new }

  describe '#string_to_subject_area_tag' do
    it 'converts a string to a LearnWorlds tag' do
      expect(worker.string_to_subject_area_tag('History / Social Studies'))
        .to eq('subject_area_history_social_studies')
      expect(worker.string_to_subject_area_tag('English as a New Language'))
        .to eq('subject_area_english_as_a_new_language')
    end
  end

  describe '#tags' do
    subject { worker.tags(user) }

    let(:user) { create(:user) }

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
      allow(worker).to receive(:enqueue_jobs)
      worker
      expect(worker.learnworlds_suspended_ids).to eq [1,2]
    end
  end
end
