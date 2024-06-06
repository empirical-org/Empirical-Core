# frozen_string_literal: true

# This migration comes from evidence (originally 20240605170721)
class CreatePromptTemplateVariables < ActiveRecord::Migration[7.0]
  def change
    create_table :evidence_research_gen_ai_prompt_template_variables do |t|
      t.string :name, null: false
      t.text :value, null: false

      t.timestamps
    end
  end
end
