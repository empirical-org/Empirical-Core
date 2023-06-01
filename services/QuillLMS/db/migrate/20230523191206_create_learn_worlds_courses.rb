# frozen_string_literal: true

class CreateLearnWorldsCourses < ActiveRecord::Migration[6.1]
  def change
    create_table :learn_worlds_courses do |t|
      t.string :title, null: false
      t.string :external_id, null: false

      t.timestamps
    end
  end
end
