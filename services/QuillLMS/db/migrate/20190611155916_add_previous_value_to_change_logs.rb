class AddPreviousValueToChangeLogs < ActiveRecord::Migration[4.2]
  def change
    add_column :change_logs, :changed_attribute, :string, after: :action
    add_column :change_logs, :previous_value, :text, after: :action
    add_column :change_logs, :new_value, :text, after: :action
  end
end
