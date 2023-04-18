# frozen_string_literal: true

class AddRequestMadeDuringSignUpToAdminApprovalRequests < ActiveRecord::Migration[6.1]
  def change
    add_column :admin_approval_requests, :request_made_during_sign_up, :boolean, default: false
  end
end
