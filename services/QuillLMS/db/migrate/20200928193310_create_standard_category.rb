class CreateStandardCategory < ActiveRecord::Migration[4.2]
  def change
    create_table :standard_categories do |t|
      t.string :name
      t.string :uid
      t.boolean :visible, default: true

      t.timestamps null: false
    end
  end
end
