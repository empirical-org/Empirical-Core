# frozen_string_literal: true

class AddCanvasInstanceRefToProviderClassoomUser < ActiveRecord::Migration[6.1]
  def change
    add_reference :provider_classroom_users, :canvas_instance, foreign_key: true
  end
end
