class CreateUserEmailVerification < ActiveRecord::Migration[6.1]
  def change
    create_table :user_email_verifications do |t|
      t.references :user, foreign_key: true, dependent: :destroy, index: {unique: true}
      t.datetime :verified_at
      t.string :verification_method
      t.string :verification_token
      t.timestamps
    end
  end
end
