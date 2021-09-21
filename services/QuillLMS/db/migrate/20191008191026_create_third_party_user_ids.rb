class CreateThirdPartyUserIds < ActiveRecord::Migration[4.2]
  def change
    create_table :third_party_user_ids do |t|
      t.references :user, index: true, foreign_key: true
      t.string :source
      t.string :third_party_id

      t.timestamps null: false
    end
  end
end
