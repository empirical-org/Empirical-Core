# frozen_string_literal: true

class AddActivityVersionToFeedbackHistory < ActiveRecord::Migration[6.0]
  def change
    add_column :feedback_histories, :activity_version, :smallint, null: false, default: 0
  end
end
