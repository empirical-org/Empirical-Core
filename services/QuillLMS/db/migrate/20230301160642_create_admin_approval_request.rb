# frozen_string_literal: true

class CreateAdminApprovalRequest < ActiveRecord::Migration[6.1]
  def change
    create_table :admin_approval_requests do |t|
      t.references :admin_info, foreign_key: true
      t.integer :requestee_id

      t.timestamps
    end
  end
end
