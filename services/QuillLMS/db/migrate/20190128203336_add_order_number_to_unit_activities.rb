class AddOrderNumberToUnitActivities < ActiveRecord::Migration
  def change
    add_column :unit_activities, :order_number, :integer
  end
end
