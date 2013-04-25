class CreateLessons < ActiveRecord::Migration
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
