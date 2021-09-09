class CreateChapterLevels < ActiveRecord::Migration[4.2]
  def change
    create_table :chapter_levels do |t|
      t.string :name
      t.integer :position

      t.timestamps
    end
  end
end
