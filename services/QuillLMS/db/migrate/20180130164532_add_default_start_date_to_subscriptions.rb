class AddDefaultStartDateToSubscriptions < ActiveRecord::Migration[4.2]
  def change
    change_column_default :subscriptions, :start_date, Time.now
  end
end
