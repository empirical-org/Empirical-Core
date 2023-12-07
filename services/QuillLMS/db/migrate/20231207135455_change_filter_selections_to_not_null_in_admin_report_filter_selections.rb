# frozen_string_literal: true

class ChangeFilterSelectionsToNotNullInAdminReportFilterSelections < ActiveRecord::Migration[7.0]
  def change
    change_column_null :admin_report_filter_selections, :filter_selections, false
  end
end
