class AddActivityInfoToUnitTemplates < ActiveRecord::Migration
  def change
    add_column :unit_templates, :activity_info, :text
    add_index :unit_templates, :activity_info
  end
end
