# frozen_string_literal: true

class CreateSchoolCanvasInstances < ActiveRecord::Migration[6.1]
  def change
    create_table :school_canvas_instances do |t|
      t.references :school, foreign_key: true, null: false
      t.references :canvas_instance, foreign_key: true, null: false

      t.timestamps
    end
  end
end
