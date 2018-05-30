class CreateSalesContacts < ActiveRecord::Migration
  def change
    create_table :sales_contacts do |t|
      t.references :user, index: true, foreign_key: true

      t.timestamps
    end
  end
end
