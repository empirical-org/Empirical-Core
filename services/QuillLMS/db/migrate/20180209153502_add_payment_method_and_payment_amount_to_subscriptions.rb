class AddPaymentMethodAndPaymentAmountToSubscriptions < ActiveRecord::Migration
  def change
    add_column :subscriptions, :payment_method, :string, index: true
    add_column :subscriptions, :payment_amount, :integer, index: true
  end
end
