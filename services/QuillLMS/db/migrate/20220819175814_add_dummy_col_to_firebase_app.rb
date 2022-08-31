# frozen_string_literal: true

class AddDummyColToFirebaseApp < ActiveRecord::Migration[6.1]
  def change
    add_column :firebase_apps, :throwaway, :text, default: 'lorem'
  end
end
