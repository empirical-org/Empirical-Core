class AddActivityVersionToFeedbackHistory < ActiveRecord::Migration[5.1]
  def change
    add_column :feedback_histories, :activity_version, :smallint, null: false, default: 0
  end
end
