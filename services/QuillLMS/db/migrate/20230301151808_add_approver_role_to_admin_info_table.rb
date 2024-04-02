# frozen_string_literal: true

class AddApproverRoleToAdminInfoTable < ActiveRecord::Migration[6.1]
  def change
    add_column :admin_infos, :approver_role, :string
  end
end
