class AddContactUserIdToSubscription < ActiveRecord::Migration
  def change
      add_column :subscriptions, :contact_user_id, :integer
      add_index :subscriptions, :contact_user_id
  end
end
