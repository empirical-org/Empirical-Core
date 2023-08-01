# frozen_string_literal: true

class RemoveCanvasInstanceRefFromProviderClassroomUser < ActiveRecord::Migration[6.1]
  def change
    remove_reference :provider_classroom_users, :canvas_instance, foreign_key: true
  end
end
