# frozen_string_literal: true

class AddUniquenessToExternalIdInLearnWorldsAccount < ActiveRecord::Migration[6.1]
  def change
    add_index :learn_worlds_accounts, :external_id, unique: true
  end
end
