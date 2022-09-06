# frozen_string_literal: true

class CreateActivityPackSequences < ActiveRecord::Migration[6.1]
  def change
    create_table :activity_pack_sequences do |t|
      t.references :classroom, foreign_key: true
      t.references :diagnostic_activity, foreign_key: { to_table: :activities }
      t.string :release_method, default: 'immediate'

      t.timestamps
    end
  end
end
