class AddOrderToActivitiesUnitTemplates < ActiveRecord::Migration
  def change
    add_column :activities_unit_templates, :order_number, :integer
  end
end
