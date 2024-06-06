# frozen_string_literal: true

# == Schema Information
#
# Table name: evidence_research_gen_ai_activities
#
#  id           :bigint           not null, primary key
#  because_text :text             default(""), not null
#  but_text     :text             default(""), not null
#  name         :string           not null
#  so_text      :text             default(""), not null
#  text         :text             not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#
module Evidence
  module Research
    module GenAI
      class Activity < ApplicationRecord
        has_many :activity_prompt_configs,
          class_name: 'Evidence::Research::GenAI::ActivityPromptConfig',
          dependent: :destroy

        validates :name, presence: true
        validates :text, presence: true

        attr_readonly :name, :text, :because_text, :but_text, :so_text

        def to_s = name
      end
    end
  end
end
