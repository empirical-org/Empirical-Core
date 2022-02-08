# frozen_string_literal: true

class AddStrongExamplesToEvidencePrompt < ActiveRecord::Migration[5.1]
  def change
    add_column :comprehension_prompts, :first_strong_example, :string, default: ''
    add_column :comprehension_prompts, :second_strong_example, :string, default: ''
  end
end
