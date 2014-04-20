class AddUidToRules < ActiveRecord::Migration
  def change
    add_column :rules, :uid, :string
    add_index :rules, :uid, unique: true
  end
end
