# frozen_string_literal: true

class CreateProviderClassrooms < ActiveRecord::Migration[6.1]
  def change
    create_table :provider_classrooms do |t|
      t.string :type, null: false
      t.string :external_id, null: false
      t.references :classroom, index: true, foreign_key: true, null: false
      t.references :canvas_instance, index: true, foreign_key: true

      t.timestamps
    end
  end
end
