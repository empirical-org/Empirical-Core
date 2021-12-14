# frozen_string_literal: true

class AllowNullOnChangeLogUser < ActiveRecord::Migration[5.0]
  def change
    change_column_null :change_logs, :user_id, true
  end
end
