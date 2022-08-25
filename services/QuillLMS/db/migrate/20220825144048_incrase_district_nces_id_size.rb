# frozen_string_literal: true

class IncraseDistrictNcesIdSize < ActiveRecord::Migration[6.1]
  def up
    change_column :districts, :nces_id, :bigint
  end

  def down
    # NOTE: Once we actually have some columns with bigints in them
    # this rollback step will start failing until they're removed.
    # Which is to say, this probably won't actually be easily roll-back-able,
    # so this function no-ops
  end
end
