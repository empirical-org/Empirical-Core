class CreateStandard < ActiveRecord::Migration
  def change
    create_table :standards do |t|
      t.string :name
      t.string :uid
      t.integer :standard_grade_id, foreign_key: true
      t.integer :standard_category_id, foreign_key: true
      t.boolean :visible, default: true

      t.timestamps null: false
    end
  end
end
