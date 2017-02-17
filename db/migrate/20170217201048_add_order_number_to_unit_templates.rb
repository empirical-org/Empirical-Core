class AddOrderNumberToUnitTemplates < ActiveRecord::Migration
  def change
    add_column :unit_templates, :order_number, :integer
  end
end
