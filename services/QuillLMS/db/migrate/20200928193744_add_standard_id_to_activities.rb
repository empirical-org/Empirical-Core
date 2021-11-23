# frozen_string_literal: true

class AddStandardIdToActivities < ActiveRecord::Migration[4.2]
  def change
    add_reference :activities, :standard, foreign_key: true
  end
end
