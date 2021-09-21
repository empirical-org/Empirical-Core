class AddPkeyToActivitiesUnitsTemplates < ActiveRecord::Migration[4.2]
  def change
    add_column :activities_unit_templates, :id, :primary_key, auto_increment: true
  end
end
