class AddVisibleToContentPartners < ActiveRecord::Migration[4.2]
  def change
    add_column :content_partners, :visible, :boolean, default: true
  end
end
