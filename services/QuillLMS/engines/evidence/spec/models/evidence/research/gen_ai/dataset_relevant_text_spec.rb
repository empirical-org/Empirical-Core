# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_dataset_relevant_texts
#
#  id               :bigint           not null, primary key
#  default          :boolean          default(FALSE)
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  dataset_id       :integer          not null
#  relevant_text_id :integer          not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe DatasetRelevantText, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should belong_to(:dataset) }
        it { should belong_to(:relevant_text) }

        it { should validate_presence_of(:dataset_id) }
        it { should validate_presence_of(:relevant_text_id) }

        it { should have_readonly_attribute(:dataset_id) }
        it { should have_readonly_attribute(:relevant_text_id) }
      end
    end
  end
end
