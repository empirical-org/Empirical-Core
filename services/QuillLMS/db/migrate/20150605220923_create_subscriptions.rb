class CreateSubscriptions < ActiveRecord::Migration
  def change
    create_table :subscriptions do |t|
      t.belongs_to :user
      t.date :expiration
      t.integer :account_limit
    end
  end
end
