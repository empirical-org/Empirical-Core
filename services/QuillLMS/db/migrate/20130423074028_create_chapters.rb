class CreateChapters < ActiveRecord::Migration[4.2]
  def change
    create_table :chapters do |t|
      t.string :title
      t.text :description
      t.timestamps
    end
  end
end
