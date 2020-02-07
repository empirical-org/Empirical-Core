class AllowNullOnChangeLogsColumn < ActiveRecord::Migration
  def change
    change_column_null :change_logs, :changed_record_id, true
    change_column_null :change_logs, :explanation, true
  end
end
