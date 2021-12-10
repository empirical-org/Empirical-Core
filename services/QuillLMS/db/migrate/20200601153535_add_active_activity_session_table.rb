# frozen_string_literal: true

class AddActiveActivitySessionTable < ActiveRecord::Migration[4.2]
  def change
    create_table :active_activity_sessions do |t|
      t.string :uid
      t.jsonb :data

      t.timestamps null: false

      t.index :uid, unique: true
    end
  end
end
