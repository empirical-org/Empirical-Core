class CreateLearnWorldsAccounts < ActiveRecord::Migration[6.1]
  def change
    create_table :learn_worlds_accounts do |t|
      t.references :user, foreign_key: true
      t.string :external_id, null: false

      t.timestamps
    end
  end
end
