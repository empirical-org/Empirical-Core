class ChangeDefaultStartDate < ActiveRecord::Migration
  def change
    change_column_default(:subscriptions, :start_date, nil)
  end
end
