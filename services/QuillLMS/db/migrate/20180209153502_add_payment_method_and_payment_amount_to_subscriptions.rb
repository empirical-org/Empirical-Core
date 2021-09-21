class AddPaymentMethodAndPaymentAmountToSubscriptions < ActiveRecord::Migration[4.2]
  def change
    add_column :subscriptions, :payment_method, :string, index: true
    add_column :subscriptions, :payment_amount, :integer, index: true
  end
end
