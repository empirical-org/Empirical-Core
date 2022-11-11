# frozen_string_literal: true

class CreateTeacherInfo < ActiveRecord::Migration[6.1]
  def change
    create_table :teacher_infos do |t|
      t.integer :minimum_grade_level
      t.integer :maximum_grade_level
      t.references :user, null: false, presence: true

      t.timestamps
    end
  end
end
