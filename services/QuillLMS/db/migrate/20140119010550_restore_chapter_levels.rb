class RestoreChapterLevels < ActiveRecord::Migration
  def change
    create_table :chapter_levels, force: true do |t|
      t.string   :name
      t.integer  :position
      t.datetime :created_at
      t.datetime :updated_at
      t.integer  :workbook_id

      t.timestamps
    end
  end
end
