class AddFieldsToUnitTemplates < ActiveRecord::Migration
  def change
    add_column :unit_templates, :time, :integer
    add_column :unit_templates, :description, :text
  end
end
