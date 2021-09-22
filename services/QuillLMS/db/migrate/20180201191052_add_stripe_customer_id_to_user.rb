class AddStripeCustomerIdToUser < ActiveRecord::Migration[4.2]
  def change
    add_column :users, :stripe_customer_id, :string
    add_index :users, :stripe_customer_id
  end
end
