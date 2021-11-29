# frozen_string_literal: true

class CreateAssessments < ActiveRecord::Migration[4.2]
  def change
    create_table :assessments do |t|
      t.text :title
      t.text :body
      t.integer :chapter_id
      t.timestamps
    end
  end
end
