# frozen_string_literal: true

class AddNullConstraintsToPackSequence < ActiveRecord::Migration[6.1]
  def change
    change_column_null :pack_sequences, :classroom_id, false
    change_column_null :pack_sequences, :diagnostic_activity_id, false
    change_column_default :pack_sequences, :release_method, from: nil, to: :staggered
  end
end
