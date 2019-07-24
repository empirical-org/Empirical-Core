class AddImageLinkToUnitTemplates < ActiveRecord::Migration
  def change
    add_column :unit_templates, :image_link, :string
  end
end
