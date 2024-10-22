# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe GenAiRecordBuilder do
    subject { described_class.run(activity, relevant_texts) }

    let(:relevant_texts) {
      {
        because_text: 'The earth is warming because of greenhouse gases.',
        so_text: 'We must take action to reduce emissions.',
        but_text: 'Not everyone agrees on the solution.'
      }
    }

    let(:activity) { create(:evidence_activity) }
    let!(:passage) { create(:evidence_passage, activity:) }
    let(:because_prompt) { create(:evidence_prompt, conjunction: 'because', activity:) }
    let(:but_prompt) { create(:evidence_prompt, conjunction: 'but', activity:) }
    let(:so_prompt) { create(:evidence_prompt, conjunction: 'so', activity:) }
    let!(:prompts) { [because_prompt, but_prompt, so_prompt] }

    before { subject }

    describe 'when no gen ai records exist' do
      it 'should create the gen ai activity' do
        gen_ai_activity = Evidence::Research::GenAI::Activity.find_by(name: activity.title)
        expect(gen_ai_activity).not_to be_nil
        expect(gen_ai_activity.text).to eq(passage.text)
        expect(gen_ai_activity.because_text).to eq(relevant_texts[:because_text])
        expect(gen_ai_activity.so_text).to eq(relevant_texts[:so_text])
        expect(gen_ai_activity.but_text).to eq(relevant_texts[:but_text])
      end

      it 'should create a stem vault for each prompt' do
        prompts.each do |prompt|
          stem_vault = Evidence::Research::GenAI::StemVault.find_by(prompt_id: prompt.id)
          expect(stem_vault).not_to be_nil
          expect(stem_vault.stem).to eq(prompt.text.split(prompt.conjunction).first.strip)
        end
      end
    end

    describe 'when gen ai records already exist' do
      let!(:gen_ai_activity) { create(:evidence_research_gen_ai_activity, name: activity.title) }
      let!(:because_stem_vault) { create(:evidence_research_gen_ai_stem_vault, activity: gen_ai_activity, prompt: because_prompt, conjunction: because_prompt.conjunction) }
      let!(:but_stem_vault) { create(:evidence_research_gen_ai_stem_vault, activity: gen_ai_activity, prompt: but_prompt, conjunction: but_prompt.conjunction) }
      let!(:so_stem_vault) { create(:evidence_research_gen_ai_stem_vault, activity: gen_ai_activity, prompt: so_prompt, conjunction: so_prompt.conjunction) }

      it 'should update the gen ai activity' do
        gen_ai_activity = Evidence::Research::GenAI::Activity.find_by(name: activity.title)
        expect(gen_ai_activity.text).to eq(passage.text)
        expect(gen_ai_activity.because_text).to eq(relevant_texts[:because_text])
        expect(gen_ai_activity.so_text).to eq(relevant_texts[:so_text])
        expect(gen_ai_activity.but_text).to eq(relevant_texts[:but_text])
      end

      it 'should update the stem vault for each prompt' do
        prompts.each do |prompt|
          stem_vault = Evidence::Research::GenAI::StemVault.find_by(prompt_id: prompt.id)
          expect(stem_vault.reload.stem).to eq(prompt.text.rpartition(prompt.conjunction).first.strip)
        end
      end
    end
  end
end
