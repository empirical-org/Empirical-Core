# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_llm_examples
#
#  id                  :bigint           not null, primary key
#  label               :string
#  llm_assigned_status :string           not null
#  llm_feedback        :text             not null
#  raw_text            :text             not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  test_example_id     :integer          not null
#  trial_id            :integer          not null
#
require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe LLMExample, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should validate_presence_of(:raw_text) }
        it { should validate_presence_of(:llm_feedback) }
        it { should validate_presence_of(:test_example_id) }
        it { should validate_presence_of(:trial_id) }

        it { should have_readonly_attribute(:raw_text) }
        it { should have_readonly_attribute(:llm_feedback) }
        it { should have_readonly_attribute(:label) }
        it { should have_readonly_attribute(:test_example_id) }
        it { should have_readonly_attribute(:trial_id) }

        it { should belong_to(:test_example) }
        it { should belong_to(:trial) }

        describe '#optimal_or_suboptimal_match?' do
          subject { llm_example.optimal_or_suboptimal_match? }

          let(:optimal) { described_class::OPTIMAL }
          let(:suboptimal) { described_class::SUBOPTIMAL }

          let(:test_example) { create(:evidence_research_gen_ai_test_example, curriculum_assigned_status:) }
          let(:llm_example) { create(factory, test_example: test_example, llm_assigned_status:) }

          context 'test example is optimal' do
            let(:curriculum_assigned_status) { optimal }

            context 'llm example is optimal' do
              let(:llm_assigned_status) { optimal }

              it { is_expected.to be true }
            end

            context 'llm example is suboptimal' do
              let(:llm_assigned_status) { suboptimal }

              it { is_expected.to be false }
            end
          end

          context 'test example is suboptimal' do
            let(:curriculum_assigned_status) { suboptimal }

            context 'llm example is optimal' do
              let(:llm_assigned_status) { optimal }

              it { is_expected.to be false }
            end

            context 'llm example is suboptimal' do
              let(:llm_assigned_status) { suboptimal }

              it { is_expected.to be true }
            end
          end
        end

        it_behaves_like 'has_assigned_status'
      end
    end
  end
end
