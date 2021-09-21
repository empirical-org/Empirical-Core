class AddOrderNumberToUnitTemplates < ActiveRecord::Migration[4.2]
  def change
    add_column :unit_templates, :order_number, :integer, default: 999999999
  end
end
