# frozen_string_literal: true

class AddEssentialKnowledgeFieldToEvidencePassage < ActiveRecord::Migration[5.1]
  def change
    add_column :comprehension_passages, :essential_knowledge_text, :string, default: ''
  end
end
