class AllowNullOnChangeLogsColumn < ActiveRecord::Migration[4.2]
  def change
    change_column_null :change_logs, :changed_record_id, true
    change_column_null :change_logs, :explanation, true
  end
end
