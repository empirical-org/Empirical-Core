class AddFieldsToUnitTemplates < ActiveRecord::Migration[4.2]
  def change
    add_column :unit_templates, :time, :integer
    add_column :unit_templates, :description, :text
  end
end
