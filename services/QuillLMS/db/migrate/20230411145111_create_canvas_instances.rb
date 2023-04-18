# frozen_string_literal: true

class CreateCanvasInstances < ActiveRecord::Migration[6.1]
  def change
    create_table :canvas_instances do |t|
      t.string :url, null: false

      t.timestamps
    end
  end
end
