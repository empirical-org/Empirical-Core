class CreateAuthCredentials < ActiveRecord::Migration
  def change
    create_table :auth_credentials do |t|
      t.references :user, index: true, foreign_key: true, null: false
      t.string :refresh_token, index: true
      t.timestamp :expires_at, :timestamp
      t.string :access_token, index: true, null: false
      t.string :provider, index: true, null: false
      t.timestamps
    end
  end
end
