class DropWorkBooksTable < ActiveRecord::Migration[4.2]
  def change
    drop_table :workbooks
  end
end
