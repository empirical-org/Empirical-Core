# frozen_string_literal: true

class CreateUserPackSequenceItems < ActiveRecord::Migration[6.1]
  def change
    create_table :user_pack_sequence_items do |t|
      t.references :user, foreign_key: true, null: false
      t.references :pack_sequence_item, foreign_key: true, null: false
      t.string :status, default: UserPackSequenceItem::LOCKED

      t.timestamps
    end
  end
end
