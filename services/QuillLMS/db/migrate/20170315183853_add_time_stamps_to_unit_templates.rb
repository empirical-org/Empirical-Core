class AddTimeStampsToUnitTemplates < ActiveRecord::Migration[4.2]
  def change
    add_column :unit_templates, :created_at, :datetime
    add_column :unit_templates, :updated_at, :datetime
  end
end
