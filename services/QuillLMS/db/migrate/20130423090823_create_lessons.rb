# frozen_string_literal: true

class CreateLessons < ActiveRecord::Migration[4.2]
  def change
    create_table :lessons do |t|
      t.integer :order
      t.text :rule
      t.text :body
      t.integer :chapter_id

      t.timestamps
    end
  end
end
