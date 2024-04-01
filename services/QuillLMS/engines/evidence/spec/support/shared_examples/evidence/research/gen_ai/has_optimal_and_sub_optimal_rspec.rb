# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.shared_examples "a class with optimal and sub-optimal" do
        describe '#optimal?' do
          subject { example_feedback.optimal? }

          let(:example_feedback) { build(:evidence_research_gen_ai_llm_feedback, text:) }

          described_class::OPTIMAL_PREFIXES.each do |prefix|
            let(:text) { "#{prefix} #{Faker::Lorem.sentence}" }

            it { is_expected.to be true }
          end

          context 'when the text does not start with an optimal prefix' do
            let(:text) { Faker::Lorem.sentence }

            it { is_expected.to be false }
          end

          context 'when the text contains a prefix but not at beginning' do
            let(:text) { "#{Faker::Lorem.sentence} #{described_class::OPTIMAL_PREFIXES.sample}" }

            it { is_expected.to be false }
          end
        end

        describe '#sub_optimal?' do
          subject { example_feedback.sub_optimal? }

          let(:example_feedback) { build(:evidence_research_gen_ai_llm_feedback) }

          before { allow(example_feedback).to receive(:optimal?).and_return(optimal) }

          context 'when the feedback is optimal' do
            let(:optimal) { true }

            it { is_expected.to be false }
          end

          context 'when the feedback is not optimal' do
            let(:optimal) { false }

            it { is_expected.to be true }
          end
        end
      end
    end
  end
end
