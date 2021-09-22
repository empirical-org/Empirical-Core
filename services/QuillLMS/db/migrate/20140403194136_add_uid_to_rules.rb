class AddUidToRules < ActiveRecord::Migration[4.2]
  def change
    add_column :rules, :uid, :string
    add_index :rules, :uid, unique: true
  end
end
