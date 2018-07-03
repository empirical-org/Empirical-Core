class RemoveCategoryFromCriteria < ActiveRecord::Migration
  def change
    remove_column :criteria, :category
  end
end
