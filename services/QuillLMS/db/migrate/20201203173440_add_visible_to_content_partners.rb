class AddVisibleToContentPartners < ActiveRecord::Migration
  def change
    add_column :content_partners, :visible, :boolean, default: true
  end
end
