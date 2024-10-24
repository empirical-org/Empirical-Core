# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_relevant_texts
#
#  id            :bigint           not null, primary key
#  notes         :text             default("")
#  text          :text             not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  stem_vault_id :integer
#
module Evidence
  module Research
    module GenAI
      class RelevantText < ApplicationRecord
        validates :text, presence: true
        attr_readonly :text
      end
    end
  end
end
