# frozen_string_literal: true

class CreateCanvasAccounts < ActiveRecord::Migration[6.1]
  def change
    create_table :canvas_accounts do |t|
      t.references :user, foreign_key: true, null: false
      t.references :canvas_config, foreign_key: true, null: false

      t.timestamps
    end
  end
end
