# frozen_string_literal: true

class CreateSchoolCanvasConfigs < ActiveRecord::Migration[6.1]
  def change
    create_table :school_canvas_configs do |t|
      t.references :school, foreign_key: true, null: false
      t.references :canvas_config, foreign_key: true, null: false

      t.timestamps
    end
  end
end
