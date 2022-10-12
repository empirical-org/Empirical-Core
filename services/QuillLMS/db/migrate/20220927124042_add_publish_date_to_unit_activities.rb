# frozen_string_literal: true

class AddPublishDateToUnitActivities < ActiveRecord::Migration[6.1]
  def change
    add_column :unit_activities, :publish_date, :datetime
  end
end
