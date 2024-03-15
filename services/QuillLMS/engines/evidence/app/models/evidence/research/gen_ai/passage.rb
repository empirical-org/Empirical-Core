# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_passages
#
#  id            :bigint           not null, primary key
#  abridged_text :text             not null
#  full_text     :text             not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
module Evidence
  module Research
    module GenAI
      class Passage < ApplicationRecord
        validates :full_text, presence: true
        validates :abridged_text, presence: true
      end
    end
  end
end
