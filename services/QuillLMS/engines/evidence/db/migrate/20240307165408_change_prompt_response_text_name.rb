# frozen_string_literal: true

class ChangePromptResponseTextName < ActiveRecord::Migration[7.0]
  def change
    rename_column :evidence_prompt_responses, :text, :response_text
  end
end
