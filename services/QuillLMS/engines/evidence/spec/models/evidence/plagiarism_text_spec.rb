# frozen_string_literal: true

# == Schema Information
#
# Table name: comprehension_plagiarism_texts
#
#  id         :integer          not null, primary key
#  rule_id    :integer          not null
#  text       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'rails_helper'

module Evidence
  RSpec.describe(PlagiarismText, :type => :model) do
    context 'relations' do
      it { should belong_to(:rule) }
    end

    context 'should validations' do
      it { should validate_presence_of(:rule) }
      it { should validate_presence_of(:text) }
    end

    context 'should serializable_hash' do
      let!(:plagiarism_text) { create(:evidence_plagiarism_text) }

      it 'fill out hash with all fields' do
        json_hash = plagiarism_text.as_json
        expect(plagiarism_text.id).to(eq(json_hash['id']))
        expect(plagiarism_text.text).to(eq(json_hash['text']))
      end
    end

    describe 'checks to make sure plagiarism text matches associated passages' do
      let(:rule) { create(:evidence_rule) }
      let!(:prompts) do
        [
          create(:evidence_prompt, activity: create(:evidence_activity, passages: [create(:evidence_passage, text: 'This is passage one it is at least fifty characters long and passes all validations.')])),
          create(:evidence_prompt, activity: create(:evidence_activity, passages: [create(:evidence_passage, text: 'This is passage two it is at least fifty characters long and passes all validations.')]))
        ]
      end
      let!(:prompts_rules) do
        prompts.map { |prompt| create(:evidence_prompts_rule, prompt: prompt, rule: rule) }
      end
      let(:plagiarism_text) { create(:evidence_plagiarism_text, rule: rule, text: 'it is at least fifty characters long and passes all validations.') }

      context 'invalid_activity_ids method' do
        it 'returns nil when all related passages include the text' do
          expect(plagiarism_text.invalid_activity_ids).to be_nil
        end

        it 'returns activity IDs when related passages do not include the text' do
          plagiarism_text.update(text: 'This is passage two')
          invalid_ids = [prompts.first.activity.id]
          expect(plagiarism_text.invalid_activity_ids).to eq(invalid_ids)
        end
      end

      context 'valid_in_all_targets method' do
        it 'returns true when valid in all targets' do
          expect(plagiarism_text.valid_in_all_targets).to be_truthy
        end

        it 'returns false when not valid in all targets' do
          plagiarism_text.update(text: 'This is passage one')
          expect(plagiarism_text.valid_in_all_targets).to be_falsey
        end
      end
    end
  end
end
