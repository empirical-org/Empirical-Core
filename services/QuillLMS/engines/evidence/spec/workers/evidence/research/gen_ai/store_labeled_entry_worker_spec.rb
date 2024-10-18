# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe StoreLabeledEntryWorker do
        subject { described_class.new.perform(entry, label, prompt_id) }

        let(:prompt_id) { create(:evidence_prompt).id }
        let(:dimension) { LabeledEntry::DIMENSION }
        let(:model) { LabeledEntry::MODEL }
        let(:entry) { 'Test entry' }
        let(:label) { 'Test label' }
        let(:embedding) { Array.new(dimension, 0) }

        before do
          allow(Evidence::OpenAI::EmbeddingFetcher)
            .to receive(:run)
            .with(dimension:, input: entry, model:)
            .and_return(embedding)
        end

        context 'when LabeledEntry does not exist' do
          it { expect { subject }.to change(Evidence::LabeledEntry, :count).by(1) }
        end

        context 'when LabeledEntry already exists' do
          let(:old_label) { 'Old label' }
          let!(:existing_labeled_entry) { create(:evidence_labeled_entry, prompt_id:, entry:, label: old_label) }

          it 'updates the existing LabeledEntry' do
            expect { subject }.not_to change(Evidence::LabeledEntry, :count)

            expect(existing_labeled_entry.reload.label).to eq(old_label)
          end
        end

        context 'when the prompt does not exist' do
          let(:prompt_id) { 0 }

          it { expect { subject }.to raise_error(ActiveRecord::RecordNotFound) }
        end
      end
    end
  end
end
