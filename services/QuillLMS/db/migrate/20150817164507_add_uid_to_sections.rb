class AddUidToSections < ActiveRecord::Migration[4.2]
  def change
    add_column :sections, :uid, :string
  end
end
