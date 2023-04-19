# frozen_string_literal: true

class CreateCanvasInstanceSchools < ActiveRecord::Migration[6.1]
  def change
    create_table :canvas_instance_schools do |t|
      t.references :school, foreign_key: true, null: false
      t.references :canvas_instance, foreign_key: true, null: false

      t.timestamps
    end

    add_index :canvas_instance_schools,
      [:canvas_instance_id, :school_id],
      name: :index_canvas_instance_schools_on_canvas_instance_and_school,
      unique: true
  end
end
