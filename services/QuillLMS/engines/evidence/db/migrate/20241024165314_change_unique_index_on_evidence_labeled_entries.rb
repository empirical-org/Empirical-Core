# frozen_string_literal: true

class ChangeUniqueIndexOnEvidenceLabeledEntries < ActiveRecord::Migration[7.1]
  def change
    add_index :evidence_labeled_entries, [:prompt_id, :entry, :label], unique: true
  end
end
