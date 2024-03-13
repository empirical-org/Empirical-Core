# frozen_string_literal: true

# This migration comes from evidence (originally 20240307165408)
class ChangePromptResponseTextName < ActiveRecord::Migration[7.0]
  def change
    rename_column :evidence_prompt_responses, :text, :response_text
  end
end
