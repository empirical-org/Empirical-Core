class RemovePurchaserEmailIndexFromSubscriptionsAndAddWithoutUniqueness < ActiveRecord::Migration
  def change
    # this was unique before, which we do not wantF
    remove_index :subscriptions, :purchaser_email
    add_index :subscriptions, :purchaser_email
  end
end
