class CreateStandard < ActiveRecord::Migration
  def change
    create_table :standards do |t|
      t.string :name
      t.string :uid
      t.references :standard_grade, foreign_key: true
      t.references :standard_category, foreign_key: true
      t.boolean :visible, default: true

      t.timestamps null: false
    end
  end
end
