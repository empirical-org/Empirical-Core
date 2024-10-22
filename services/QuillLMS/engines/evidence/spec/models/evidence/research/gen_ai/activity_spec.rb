# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_activities
#
#  id           :bigint           not null, primary key
#  because_text :text             default(""), not null
#  but_text     :text             default(""), not null
#  name         :string           not null
#  so_text      :text             default(""), not null
#  text         :text             not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe Activity, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should validate_presence_of(:name) }
        it { should validate_presence_of(:text) }

        it { should have_many(:stem_vaults).dependent(:destroy) }

        describe '#invalid_relevant_text_keys' do
          let(:activity) do
            described_class.new(
              because_text:,
              but_text:,
              so_text:,
              text:
            )
          end
          let(:because_text) { 'The sky is blue.' }
          let(:but_text) { 'However, it may rain tomorrow.' }
          let(:so_text) { 'So, bring an umbrella.' }
          let(:text) { 'The sky is blue. However, it may rain tomorrow. So, bring an umbrella.' }

          subject { activity.invalid_relevant_text_keys }

          context 'when all sentences are present in the text' do
            it { is_expected.to eq [] }
          end

          context 'when one sentence is missing from the text' do
            let(:text) { "#{because_text} #{so_text}" }

            it { is_expected.to contain_exactly(:but_text) }
          end

          context 'when multiple sentences are missing from the text' do
            let(:text) { because_text }

            it { is_expected.to contain_exactly(:but_text, :so_text) }
          end

          context 'when the sentences differ only by case or punctuation' do
            let(:text) { 'the sky is blue! however it may rain tomorrow... so bring an umbrella' }

            it { is_expected.to eq [] }
          end

          context 'when the sentences contain HTML that is stripped' do
            let(:because_text) { '<p>The sky is blue.</p>' }
            let(:but_text) { '<div>However, it may rain tomorrow.</div>' }
            let(:so_text) { '<span>So, bring an umbrella.</span>' }
            let(:text) { 'The sky is blue. However, it may rain tomorrow. So, bring an umbrella.' }

            it { is_expected.to eq [] }
          end

          context 'when none of the sentences are present in the text' do
            let(:text) { 'This is completely unrelated text.' }

            it { is_expected.to contain_exactly(:because_text, :but_text, :so_text) }
          end
        end
      end
    end
  end
end
