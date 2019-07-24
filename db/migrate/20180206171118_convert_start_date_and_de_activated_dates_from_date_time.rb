class ConvertStartDateAndDeActivatedDatesFromDateTime < ActiveRecord::Migration
  def change
    change_column :subscriptions, :start_date, :date
    change_column :subscriptions, :de_activated_date, :date
  end
end
