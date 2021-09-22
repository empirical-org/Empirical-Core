class AddOrderToActivitiesUnitTemplates < ActiveRecord::Migration[4.2]
  def change
    add_column :activities_unit_templates, :order_number, :integer
  end
end
