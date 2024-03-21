# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_passages
#
#  id         :bigint           not null, primary key
#  contents   :text             not null
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe Passage, type: :model do
        it { should validate_presence_of(:name) }
        it { should validate_presence_of(:contents) }
        it { should have_many(:passage_prompts).class_name('Evidence::Research::GenAI::PassagePrompt').dependent(:destroy) }

        it { expect(build(:evidence_research_gen_ai_passage)).to be_valid }
      end
    end
  end
end
