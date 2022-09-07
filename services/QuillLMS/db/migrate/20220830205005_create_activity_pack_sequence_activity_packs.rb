# frozen_string_literal: true

class CreateActivityPackSequenceActivityPacks < ActiveRecord::Migration[6.1]
  def change
    create_table :activity_pack_sequence_activity_packs do |t|
      t.references :activity_pack, foreign_key: { to_table: :units }
      t.references :activity_pack_sequence,
        foreign_key: true,
        index: { name: 'index_activity_pack_sequence_activity_packs_on_act_pack_seq_id' }

      t.integer :order

      t.timestamps
    end
  end
end
