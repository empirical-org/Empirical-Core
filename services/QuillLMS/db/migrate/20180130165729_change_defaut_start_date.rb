# frozen_string_literal: true

class ChangeDefautStartDate < ActiveRecord::Migration[4.2]
  def change
    change_column_default :subscriptions, :start_date, Date.current
  end
end
