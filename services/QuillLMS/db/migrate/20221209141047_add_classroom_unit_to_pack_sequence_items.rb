# frozen_string_literal: true

class AddClassroomUnitToPackSequenceItems < ActiveRecord::Migration[6.1]
  def change
    add_reference :pack_sequence_items, :classroom_unit, foreign_key: true, null: false

    add_index :pack_sequence_items,
      [:classroom_unit_id, :pack_sequence_id],
      name: :index_pack_sequence_items__classroom_unit_id__pack_sequence_id,
      unique: true
  end
end
