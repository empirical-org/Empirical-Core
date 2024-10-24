# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_relevant_texts
#
#  id         :bigint           not null, primary key
#  notes      :text             default("")
#  text       :text             not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

module Evidence
  module Research
    module GenAI
      RSpec.describe RelevantText, type: :model do
        let(:factory) { described_class.model_name.singular.to_sym }

        it { expect(build(factory)).to be_valid }

        it { should validate_presence_of(:text) }

        it { should have_readonly_attribute(:text) }
      end
    end
  end
end
