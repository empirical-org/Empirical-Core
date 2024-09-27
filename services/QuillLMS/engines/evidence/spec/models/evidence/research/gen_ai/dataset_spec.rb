# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_datasets
#
#  id               :bigint           not null, primary key
#  locked           :boolean          default(FALSE), not null
#  optimal_count    :integer          default(0), not null
#  suboptimal_count :integer          default(0), not null
#  task_type        :string           not null
#  version          :integer          not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  parent_id        :integer
#  stem_vault_id    :integer          not null
#
require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe Dataset, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should validate_presence_of(:optimal_count) }
        it { should validate_presence_of(:suboptimal_count) }
        it { should validate_presence_of(:stem_vault) }

        it { should have_readonly_attribute(:locked) }
        it { should have_readonly_attribute(:stem_vault_id) }
        it { should have_readonly_attribute(:optimal_count) }
        it { should have_readonly_attribute(:suboptimal_count) }
        it { should have_readonly_attribute(:version) }
        it { should have_readonly_attribute(:task_type) }

        it { have_many(:test_examples).dependent(:destroy) }
        it { have_many(:prompt_examples).dependent(:destroy) }
        it { have_many(:trials).dependent(:destroy) }
        it { have_many(:trial_comparisons).dependent(:destroy) }
        it { have_many(:comparisons).through(:trial_comparisons) }

        it { should belong_to(:stem_vault) }

        describe '#set_version' do
          let(:stem_vault) { create(:evidence_research_gen_ai_stem_vault) }

          context 'when there are no existing datasets' do
            let(:dataset) { create(factory, stem_vault:) }

            it { expect(dataset.version).to eq(1) }
          end

          context 'when there are existing datasets with same parents' do
            let(:dataset) { create(factory, stem_vault:, parent_id: 1) }

            before { create(factory, stem_vault:, parent_id: 1) }

            it { expect(dataset.version).to eq(2) }
          end

          context 'when there are existing datasets with different parents' do
            let(:dataset) { create(factory, stem_vault:, parent_id: 1) }

            before { create(factory, stem_vault:, parent_id: 2) }

            it { expect(dataset.version).to eq(1) }
          end
        end
      end
    end
  end
end
