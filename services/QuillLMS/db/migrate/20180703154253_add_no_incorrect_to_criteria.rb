class AddNoIncorrectToCriteria < ActiveRecord::Migration[4.2]
  def change
    add_column :criteria, :no_incorrect, :boolean, null: false, default: false
  end
end
