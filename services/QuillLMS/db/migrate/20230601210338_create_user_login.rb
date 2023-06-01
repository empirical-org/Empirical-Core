class CreateUserLogin < ActiveRecord::Migration[6.1]
  def change
    create_table :user_logins do |t|
      t.references :user, index: true, foreign_key: true, null: false

      t.datetime :created_at, null: false
    end
  end
end
