class AddPartnerContent < ActiveRecord::Migration[4.2]
  def change
    create_table :partner_contents do |t|
      t.string :partner, limit: 50
      t.string :content_type, limit: 50
      t.integer :content_id
      t.integer :order

      t.timestamps null: false
    end

    add_index :partner_contents, :partner
    add_index :partner_contents, [:content_type, :content_id]
  end
end
