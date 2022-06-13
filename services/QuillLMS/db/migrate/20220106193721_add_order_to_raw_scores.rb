# frozen_string_literal: true

class AddOrderToRawScores < ActiveRecord::Migration[5.1]
  def change
    add_column :raw_scores, :order, :integer, null: true
    RawScore.all.each {|rs| rs.update(order: rs.id)}
    change_column_null :raw_scores, :order, false
  end
end
