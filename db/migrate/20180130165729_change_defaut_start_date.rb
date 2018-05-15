class ChangeDefautStartDate < ActiveRecord::Migration
  def change
    change_column_default :subscriptions, :start_date, Date.today
  end
end
