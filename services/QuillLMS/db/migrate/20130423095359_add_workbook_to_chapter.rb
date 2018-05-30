class AddWorkbookToChapter < ActiveRecord::Migration
  def change
    add_column :chapters, :workbook_id, :integer
  end
end
