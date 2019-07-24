class RemoveWorkBookIdColumnFromSectionsTable < ActiveRecord::Migration
  def change
    remove_column :sections, :workbook_id
  end
end
