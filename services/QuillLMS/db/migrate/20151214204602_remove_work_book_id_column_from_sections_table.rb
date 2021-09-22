class RemoveWorkBookIdColumnFromSectionsTable < ActiveRecord::Migration[4.2]
  def change
    remove_column :sections, :workbook_id
  end
end
