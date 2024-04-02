# frozen_string_literal: true

class AddClientIdClientSecretToCanvasConfig < ActiveRecord::Migration[7.0]
  def change
    add_column :canvas_configs, :client_id, :text, null: false
    add_column :canvas_configs, :client_secret, :text, null: false
  end
end
