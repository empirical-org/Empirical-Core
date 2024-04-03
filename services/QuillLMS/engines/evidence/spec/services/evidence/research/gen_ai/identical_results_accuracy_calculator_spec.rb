# frozen_string_literal: true

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe IdenticalResultsAccuracyCalculator, type: :service do
        subject { described_class.run(experiment) }

        let(:experiment) { create(:evidence_research_gen_ai_experiment) }

        before { allow(experiment).to receive(:llm_feedbacks).and_return(llm_feedbacks) }

        context 'when there are no llm feedbacks' do
          let(:llm_feedbacks) { [] }

          it { is_expected.to eq nil }
        end

        context 'with identical feedback' do
          let(:llm_feedbacks) { [double(identical_feedback?: true)] }

          it { is_expected.to eq 1.0 }
        end

        context 'with non-identical feedback' do
          let(:llm_feedbacks) { [double(identical_feedback?: false)] }

          it { is_expected.to eq 0 }
        end

        context 'with mixed feedbacks' do
          let(:llm_feedbacks) { [double(identical_feedback?: true), double(identical_feedback?: false)] }

          it { is_expected.to eq 0.5 }
        end
      end
    end
  end
end
