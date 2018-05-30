class CreateSalesAccounts < ActiveRecord::Migration
  def change
    create_table :sales_accounts do |t|
      t.references :school, index: true, foreign_key: true
      t.jsonb :data, default: {}

      t.timestamps null: false
    end
  end
end
