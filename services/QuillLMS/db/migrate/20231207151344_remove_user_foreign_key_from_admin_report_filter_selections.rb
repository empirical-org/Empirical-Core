# frozen_string_literal: true

class RemoveUserForeignKeyFromAdminReportFilterSelections < ActiveRecord::Migration[7.0]
  def change
    remove_foreign_key :admin_report_filter_selections, :users
  end
end
