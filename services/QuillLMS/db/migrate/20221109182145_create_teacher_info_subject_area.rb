# frozen_string_literal: true

class CreateTeacherInfoSubjectArea < ActiveRecord::Migration[6.1]
  def change
    create_table :teacher_info_subject_areas do |t|
      t.references :teacher_info, null: false, foreign_key: true
      t.references :subject_area, null: false, foreign_key: true

      t.timestamps
    end
  end
end
