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

      it "fill out hash with all fields" do
        json_hash = plagiarism_text.as_json
        expect(plagiarism_text.id).to(eq(json_hash["id"]))
        expect(plagiarism_text.text).to(eq(json_hash["text"]))
      end
    end

    context '#invalid_activity_ids' do
      let(:activity) { create(:evidence_activity, :with_prompt_and_passage) }
      let(:rule) { create(:evidence_rule, prompts: [activity.prompts.first]) }
      let(:plagiarism_text) { create(:evidence_plagiarism_text, rule: rule, text: activity.passages.first.text) }

      it 'should return an nil if highlight_type is "passage" but all passages contain the highlight' do
        expect(plagiarism_text.invalid_activity_ids).to be_nil
      end

      it 'should return an array of activity_ids for activities that have unmatched passages' do
        plagiarism_text.update(text: 'text that definitely is not in the passage')
        expect(plagiarism_text.invalid_activity_ids).to include(activity.id)
      end

      it 'should not include activity_ids for activities with matched passages' do
        plagiarism_text.update(text: 'text that definitely is not in the passage')
        unmatched_activity = create(:evidence_activity, :with_prompt_and_passage)
        expect(plagiarism_text.invalid_activity_ids).not_to include(unmatched_activity.id)
      end
    end
  end
end
