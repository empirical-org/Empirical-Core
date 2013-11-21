class CreateChapterLevels < ActiveRecord::Migration
  def change
    create_table :chapter_levels do |t|
      t.string :name
      t.integer :position

      t.timestamps
    end
  end
end
