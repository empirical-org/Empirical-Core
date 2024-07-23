# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_stem_vaults
#
#  id          :bigint           not null, primary key
#  conjunction :string           not null
#  stem        :text             not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  activity_id :integer          not null
#
require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe StemVault, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should validate_presence_of(:stem) }
        it { should validate_presence_of(:conjunction) }
        it { should validate_presence_of(:activity_id) }
        it { should validate_inclusion_of(:conjunction).in_array(described_class::CONJUNCTIONS) }
        it { should have_readonly_attribute(:stem) }
        it { should have_readonly_attribute(:conjunction) }
        it { should have_readonly_attribute(:activity_id) }

        it { should belong_to(:activity) }

        it { have_many(:student_responses).dependent(:destroy) }
        it { have_many(:quill_feedbacks).through(:student_responses) }
        it { have_many(:llm_feedbacks).through(:student_responses) }
        it { have_many(:trials).dependent(:destroy) }
        it { have_many(:guidelines).dependent(:destroy) }

        describe '#relevant_text' do
          subject { stem_vault.relevant_text }

          let(:stem_vault) { create(factory, conjunction:) }

          context 'when conjunction is because' do
            let(:conjunction) { described_class::BECAUSE }

            it { is_expected.to eq stem_vault.because_text }
          end

          context 'when conjunction is but' do
            let(:conjunction) { described_class::BUT }

            it { is_expected.to eq stem_vault.but_text }
          end

          context 'when conjunction is so' do
            let(:conjunction) { described_class::SO }

            it { is_expected.to eq stem_vault.so_text }
          end
        end
      end
    end
  end
end
