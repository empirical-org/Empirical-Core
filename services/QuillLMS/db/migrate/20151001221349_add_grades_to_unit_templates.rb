class AddGradesToUnitTemplates < ActiveRecord::Migration
  def change
    add_column :unit_templates, :grades, :text
  end
end
