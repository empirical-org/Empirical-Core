# frozen_string_literal: true

class CreateAdminInfo < ActiveRecord::Migration[6.1]
  def change
    create_table :admin_infos do |t|
      t.string :approval_status
      t.string :sub_role
      t.string :verification_url
      t.text :verification_reason
      t.references :user, null: false, foreign_key: true, unique: true

      t.timestamps
    end
  end
end
