# frozen_string_literal: true

class CreateCanvasConfigs < ActiveRecord::Migration[6.1]
  def change
    create_table :canvas_configs do |t|
      t.string :url, null: false
      t.text :client_id_ciphertext, null: false
      t.text :client_secret_ciphertext, null: false

      t.timestamps
    end
  end
end
