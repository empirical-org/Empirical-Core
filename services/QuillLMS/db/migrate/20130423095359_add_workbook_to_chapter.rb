# frozen_string_literal: true

class AddWorkbookToChapter < ActiveRecord::Migration[4.2]
  def change
    add_column :chapters, :workbook_id, :integer
  end
end
