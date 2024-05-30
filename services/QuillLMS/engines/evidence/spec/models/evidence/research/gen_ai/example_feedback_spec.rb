# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_example_feedbacks
#
#  id                         :bigint           not null, primary key
#  data_partition             :string
#  label                      :string           not null
#  paraphrase                 :text
#  text                       :text             not null
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  passage_prompt_response_id :integer          not null
#
require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe ExampleFeedback, type: :model do
        it { should validate_presence_of(:text) }
        it { should validate_presence_of(:label) }
        it { should validate_presence_of(:passage_prompt_response_id)}
        it { should validate_inclusion_of(:data_partition).in_array(ExampleFeedback::DATA_PARTITIONS) }

        it { should have_readonly_attribute(:text) }
        it { should have_readonly_attribute(:label) }
        it { should have_readonly_attribute(:passage_prompt_response_id) }

        it { should belong_to(:passage_prompt_response) }

        it { expect(build(:evidence_research_gen_ai_example_feedback)).to be_valid}

        context 'data_partition scopes' do
          let!(:testing_feedback) { create(:evidence_research_gen_ai_example_feedback, :testing) }
          let!(:fine_tuning_feedback) { create(:evidence_research_gen_ai_example_feedback, :fine_tuning) }
          let!(:prompt_engineering_feedback) { create(:evidence_research_gen_ai_example_feedback, :prompt_engineering) }

          it { expect(described_class.testing_data).to eq [testing_feedback] }
          it { expect(described_class.fine_tuning_data).to eq [fine_tuning_feedback] }
          it { expect(described_class.prompt_engineering_data).to eq [prompt_engineering_feedback] }
        end

        it_behaves_like 'a class with optimal and sub-optimal'
      end
    end
  end
end
