# frozen_string_literal: true

class AddTimestampsToTopics < ActiveRecord::Migration[4.2]
  def change
    add_timestamps :topics
  end
end
