class AddUidToSections < ActiveRecord::Migration
  def change
    add_column :sections, :uid, :string
  end
end
