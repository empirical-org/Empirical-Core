class DropWorkBooksTable < ActiveRecord::Migration
  def change
    drop_table :workbooks
  end
end
