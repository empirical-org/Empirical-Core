class AddDefaultStartDateToSubscriptions < ActiveRecord::Migration
  def change
    change_column_default :subscriptions, :start_date, Time.now
  end
end
