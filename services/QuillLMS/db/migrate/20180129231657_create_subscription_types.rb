class CreateSubscriptionTypes < ActiveRecord::Migration[4.2]
  def change
    create_table :subscription_types do |t|
      t.string :name, null: false, index: true
      t.timestamps
    end
  end
end
