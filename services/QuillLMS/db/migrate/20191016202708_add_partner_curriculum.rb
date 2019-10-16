class AddPartnerCurriculum < ActiveRecord::Migration
  def change
    create_table :partner_curriculums do |t|
      t.string :partner, limit: 50
      t.string :curriculum_type, limit: 50
      t.integer :curriculum_id
      t.integer :order

      t.timestamps null: false
    end

    add_index :partner_curriculums, :partner
    add_index :partner_curriculums, [:curriculum_type, :curriculum_id]
  end
end
