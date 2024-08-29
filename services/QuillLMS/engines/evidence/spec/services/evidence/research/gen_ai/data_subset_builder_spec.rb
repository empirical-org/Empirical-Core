# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe DataSubsetBuilder do
        subject { described_class.run(parent_id:, test_example_ids:) }

        let!(:dataset) { create(:evidence_research_gen_ai_dataset) }
        let!(:num_prompt_examples) { 2 }
        let!(:prompt_examples) { create_list(:evidence_research_gen_ai_prompt_example, num_prompt_examples, dataset:) }

        let(:parent_id) { dataset.id }
        let(:stem_vault_id) { dataset.stem_vault.id }
        let(:locked) { true }
        let(:num_test_optimal) { 3 }
        let(:num_test_suboptimal) { 2 }
        let(:optimal_test_examples) { create_list(:evidence_research_gen_ai_test_example, num_test_optimal, :optimal, dataset:) }
        let(:suboptimal_test_examples) { create_list(:evidence_research_gen_ai_test_example, num_test_suboptimal, :suboptimal, dataset:) }
        let(:optimal_count) { num_test_optimal - 1 }
        let(:suboptimal_count) { num_test_suboptimal - 1 }
        let(:subset_optimal_test_examples) { optimal_test_examples.first(optimal_count) }
        let(:subset_suboptimal_test_examples) { suboptimal_test_examples.first(suboptimal_count) }
        let(:subset_test_examples) { subset_optimal_test_examples + subset_suboptimal_test_examples }
        let(:test_example_ids) { subset_test_examples.pluck(:id) }

        it { expect { subject }.to change(Dataset, :count).by(1) }

        it { is_expected.to be_a(Dataset) }

        it { expect(subject.parent_id).to eq(parent_id) }
        it { expect(subject.stem_vault_id).to eq(stem_vault_id) }
        it { expect(subject.optimal_count).to eq(optimal_count) }
        it { expect(subject.suboptimal_count).to eq(suboptimal_count) }
        it { expect(subject.prompt_examples.count).to eq(num_prompt_examples) }
        it { expect(subject.test_examples.count).to eq(optimal_count + suboptimal_count) }
        it { expect(subject.prompt_examples.pluck(:student_response)).to match_array(prompt_examples.pluck(:student_response)) }
        it { expect(subject.test_examples.pluck(:student_response)).to match_array(subset_test_examples.pluck(:student_response)) }
        it { expect(subject.test_examples.pluck(:id)).not_to match_array(test_example_ids) }

        context 'when invalid parent_id is provided' do
          let(:parent_id) { -1 }

          it { expect { subject }.to raise_error(ActiveRecord::RecordNotFound) }
        end

        context 'when no test examples are selected' do
          let(:test_example_ids) { [] }

          it { expect(subject.test_examples).to be_empty }
          it { expect(subject.optimal_count).to eq(0) }
          it { expect(subject.suboptimal_count).to eq(0) }
        end

        context 'when invalid test_example_ids are provided' do
          let(:test_example_ids) { [-1, -2] }

          it { expect(subject.test_examples).to be_empty }
          it { expect(subject.optimal_count).to eq(0) }
          it { expect(subject.suboptimal_count).to eq(0) }
        end

        context 'when there is a mix of valid and invalid test_example_ids' do
          let(:test_example_ids) { optimal_test_examples.pluck(:id) + [-1, -2] }

          it { expect(subject.test_examples.count).to eq(optimal_test_examples.count) }
          it { expect(subject.optimal_count).to eq(optimal_test_examples.count) }
          it { expect(subject.suboptimal_count).to eq(0) }
        end
      end
    end
  end
end
