class CreateCreditTransactions < ActiveRecord::Migration
  def change
    create_table :credit_transactions do |t|
      t.integer :amount, null: false
      t.references :user, index: true, null: false
      t.references :source, polymorphic: true, index: true
      t.timestamps
    end
  end
end
