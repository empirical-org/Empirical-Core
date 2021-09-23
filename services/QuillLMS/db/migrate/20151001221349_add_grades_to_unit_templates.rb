class AddGradesToUnitTemplates < ActiveRecord::Migration[4.2]
  def change
    add_column :unit_templates, :grades, :text
  end
end
