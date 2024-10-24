# frozen_string_literal: true

# This migration comes from evidence (originally 20241024165314)
class ChangeUniqueIndexOnEvidenceLabeledEntries < ActiveRecord::Migration[7.1]
  def change
    remove_index :evidence_labeled_entries, [:prompt_id, :entry]
    add_index :evidence_labeled_entries, [:prompt_id, :entry, :label], unique: true
  end
end
