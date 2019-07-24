class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
      t.text :title

      t.timestamps
    end
  end
end
