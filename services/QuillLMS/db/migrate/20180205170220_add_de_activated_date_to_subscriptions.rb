class AddDeActivatedDateToSubscriptions < ActiveRecord::Migration[4.2]
  def change
    add_column :subscriptions, :de_activated_date, :datetime, default: nil
    add_index :subscriptions, :de_activated_date
  end
end
