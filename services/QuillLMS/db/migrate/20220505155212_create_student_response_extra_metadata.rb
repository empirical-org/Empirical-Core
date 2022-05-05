# frozen_string_literal: true

class CreateStudentResponseExtraMetadata < ActiveRecord::Migration[5.1]
  def change
    create_table :student_response_extra_metadata do |t|
      t.jsonb :metadata, null: false
      t.references :student_response, null: false, foreign_key: true
    end
  end
end
