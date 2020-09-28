class CreateStandardGrade < ActiveRecord::Migration
  def change
    create_table :standard_grades do |t|
      t.string :name
      t.string :uid
      t.integer :position
      t.boolean :visible, default: true

      t.timestamps null: false
    end
  end
end
