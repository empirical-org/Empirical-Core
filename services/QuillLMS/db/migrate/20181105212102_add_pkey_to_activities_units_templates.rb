class AddPkeyToActivitiesUnitsTemplates < ActiveRecord::Migration
  def change
    add_column :activities_unit_templates, :id, :primary_key, auto_increment: true
  end
end
