class CreateSubscriptions < ActiveRecord::Migration[4.2]
  def change
    create_table :subscriptions do |t|
      t.belongs_to :user
      t.date :expiration
      t.integer :account_limit
    end
  end
end
