# frozen_string_literal: true

class CreateActivityPackSequenceUnits < ActiveRecord::Migration[6.1]
  def change
    create_table :activity_pack_sequence_units do |t|
      t.references :unit, foreign_key: true
      t.references :activity_pack_sequence, foreign_key: true
      t.integer :order

      t.timestamps
    end
  end
end
