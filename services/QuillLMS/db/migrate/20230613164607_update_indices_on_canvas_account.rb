# frozen_string_literal: true

class UpdateIndicesOnCanvasAccount < ActiveRecord::Migration[6.1]
  def change
    remove_index :canvas_accounts, :canvas_instance_id
    add_index :canvas_accounts, [:canvas_instance_id, :external_id], unique: true
  end
end
