# frozen_string_literal: true

class CreateCanvasAccounts < ActiveRecord::Migration[6.1]
  def change
    create_table :canvas_accounts do |t|
      t.string :external_id, null: false
      t.references :user, foreign_key: true, null: false
      t.references :canvas_instance, foreign_key: true, null: false

      t.timestamps
    end
  end
end
