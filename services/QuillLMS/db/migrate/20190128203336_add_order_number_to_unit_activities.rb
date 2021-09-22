class AddOrderNumberToUnitActivities < ActiveRecord::Migration[4.2]
  def change
    add_column :unit_activities, :order_number, :integer, limit: 2, after: :due_date
  end
end
