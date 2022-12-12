# frozen_string_literal: true

class AddNullConstraintsToPackSequenceItem < ActiveRecord::Migration[6.1]
  def change
    change_column_null :pack_sequence_items, :order, false
    change_column_null :pack_sequence_items, :pack_sequence_id, false
  end
end
