class RemovePurchaserEmailIndexFromSubscriptionsAndAddWithoutUniqueness < ActiveRecord::Migration[4.2]
  def change
    # this was unique before, which we do not wantF
    remove_index :subscriptions, :purchaser_email
    add_index :subscriptions, :purchaser_email
  end
end
