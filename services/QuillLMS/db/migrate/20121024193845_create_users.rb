class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users, force: true do |t|
      t.string :name
      t.string :email
      t.string :password_digest
      t.string :role, default: 'user'

      t.timestamps
    end
  end
end
