# frozen_string_literal: true

class RenameActivityPackSequencesToPackSequences < ActiveRecord::Migration[6.1]
  def change
    rename_table :activity_pack_sequences, :pack_sequences
  end
end
