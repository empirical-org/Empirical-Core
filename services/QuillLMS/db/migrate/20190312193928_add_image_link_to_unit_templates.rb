class AddImageLinkToUnitTemplates < ActiveRecord::Migration[4.2]
  def change
    add_column :unit_templates, :image_link, :string
  end
end
