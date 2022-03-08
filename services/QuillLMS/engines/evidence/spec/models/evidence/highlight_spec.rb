# frozen_string_literal: true

require 'rails_helper'

module Evidence
  RSpec.describe(Highlight, :type => :model) do

    context 'should validations' do

      it { should validate_presence_of(:text) }

      it { should validate_length_of(:text).is_at_least(1).is_at_most(5000) }

      it { should validate_presence_of(:highlight_type) }

      it { should validate_inclusion_of(:highlight_type).in_array(Evidence::Highlight::TYPES) }

      it { should validate_numericality_of(:starting_index).only_integer.is_greater_than_or_equal_to(0) }
    end

    context 'should relationships' do

      it { should belong_to(:feedback) }
    end

    context '#invalid_activity_ids' do
      let(:activity) { create(:evidence_activity, :with_prompt_and_passage) }
      let(:rule) { create(:evidence_rule, prompts: [activity.prompts.first]) }
      let(:feedback) { create(:evidence_feedback, rule: rule) }
      let(:highlight) { create(:evidence_highlight, feedback: feedback,  highlight_type: 'passage', text: activity.passages.first.text) }

      it 'should return nil if the highlight_type is not "passage"' do
        highlight.update(highlight_type: 'prompt')
        expect(highlight.invalid_activity_ids).to be_nil
      end

      it 'should return an nil if highlight_type is "passage" but all passages contain the highlight' do
        expect(highlight.invalid_activity_ids).to be_nil
      end

      it 'should return nil if the passages include HTML tags but otherwise contain the highlight' do
        tag_wrapped_words = highlight.text.split.map{ |word| "<b>#{word}</b>" }.join(" ")
        activity.passages.first.update(text: tag_wrapped_words)
        expect(highlight.invalid_activity_ids).to be_nil
      end

      it 'should return nil if the is contained n the passage after HTML tags are stripped from the highlight' do
        tag_wrapped_words = highlight.text.split.map{ |word| "<b>#{word}</b>" }.join(" ")
        highlight.update(text: tag_wrapped_words)
        expect(highlight.invalid_activity_ids).to be_nil
      end

      it 'should return an array of activity_ids for activities that have unmatched passages' do
        highlight.update(text: 'text that definitely is not in the passage')
        expect(highlight.invalid_activity_ids).to include(activity.id)
      end

      it 'should not include activity_ids for activities with matched passages' do
        highlight.update(text: 'text that definitely is not in the passage')
        unmatched_activity = create(:evidence_activity, :with_prompt_and_passage)
        expect(highlight.invalid_activity_ids).not_to include(unmatched_activity.id)
      end
    end
  end
end
