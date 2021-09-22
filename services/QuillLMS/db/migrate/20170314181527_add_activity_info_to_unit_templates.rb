class AddActivityInfoToUnitTemplates < ActiveRecord::Migration[4.2]
  def change
    add_column :unit_templates, :activity_info, :text
    add_index :unit_templates, :activity_info
  end
end
