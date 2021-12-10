# frozen_string_literal: true

class CreateAdminRelationships < ActiveRecord::Migration[4.2]
  def change
    create_table :admin_relationships do |t|
      t.integer :admin_id
      t.integer :teacher_id

      t.timestamps
    end

    add_index :admin_relationships, :admin_id
    add_index :admin_relationships, :teacher_id
    add_index :admin_relationships, [:admin_id, :teacher_id], unique: true
  end
end
