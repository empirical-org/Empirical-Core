# frozen_string_literal: true

class CreateSchoolCanvasInstances < ActiveRecord::Migration[6.1]
  def change
    create_table :school_canvas_instances do |t|
      t.references :school, foreign_key: true, null: false
      t.references :canvas_instance, foreign_key: true, null: false

      t.timestamps
    end

    add_index :school_canvas_instances,
      [:canvas_instance_id, :school_id],
      name: :index_school_canvas_instances_on_canvas_instance_and_school,
      unique: true
  end
end
