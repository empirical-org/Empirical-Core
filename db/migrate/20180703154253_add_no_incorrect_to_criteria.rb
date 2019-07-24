class AddNoIncorrectToCriteria < ActiveRecord::Migration
  def change
    add_column :criteria, :no_incorrect, :boolean, null: false, default: false
  end
end
