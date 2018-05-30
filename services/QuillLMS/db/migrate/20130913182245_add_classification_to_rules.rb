class AddClassificationToRules < ActiveRecord::Migration
  def change
    add_column :rules, :classification, :string
  end
end
