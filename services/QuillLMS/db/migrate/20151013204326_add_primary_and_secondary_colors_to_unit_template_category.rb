class AddPrimaryAndSecondaryColorsToUnitTemplateCategory < ActiveRecord::Migration[4.2]
  def change
    add_column :unit_template_categories, :primary_color, :string
    add_column :unit_template_categories, :secondary_color, :string
  end
end
